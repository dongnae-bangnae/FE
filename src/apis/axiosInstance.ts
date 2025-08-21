// src/apis/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  type AxiosRequestHeaders
} from "axios";

// /** 쿠키 읽기 (HttpOnly 쿠키는 읽히지 않음) */
function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

function getAccessToken(): string | null {
  return (
    localStorage.getItem("accessToken") ||
    getCookieValue("Authorization") ||
    getCookieValue("accessToken") ||
    null
  );
}

/** headers를 AxiosHeaders 인스턴스로 보장 */
function ensureAxiosHeaders(
  headers?: AxiosRequestHeaders | undefined
): AxiosHeaders {
  if (headers instanceof AxiosHeaders) return headers;
  // 기존 값이 plain object여도 여기서 AxiosHeaders로 흡수
  return new AxiosHeaders(headers ?? {});
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true // JWT/refresh/JSESSIONID 쿠키 전송
  // xsrfCookieName: "XSRF-TOKEN",
  // xsrfHeaderName: "X-XSRF-TOKEN"
});

/* ------------------- 요청: CSRF 헤더 자동 주입 + 디버그 헤더 ------------------- */
axiosInstance.interceptors.request.use((config) => {
  // 항상 AxiosHeaders로 변환
  const h = ensureAxiosHeaders(config.headers as AxiosRequestHeaders);

  // 디버그 라벨 (이 instance에서 나간 요청인지 구분)
  h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

  // // CSRF 쿠키가 있을 때만 XSRF 헤더 추가
  // const csrf = getCookieValue("XSRF-TOKEN");
  // if (csrf) {
  //   h.set("X-XSRF-TOKEN", csrf);
  // }
  if (!h.has("Authorization")) {
    const token = getAccessToken();
    if (token) h.set("Authorization", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
  }

  config.headers = h;
  config.withCredentials = true;
  return config;
});

/* -------- 응답: accessToken 만료 시 /api/auth/reissue 호출 -------- */
let isRefreshing = false;
let waiters: Array<(ok: boolean) => void> = [];

async function refreshAccessToken(): Promise<boolean> {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/reissue`,
      null,
      { withCredentials: true }
    );
    return true; // 서버가 Set-Cookie로 새 accessToken 내려줌(전제)
  } catch {
    return false;
  }
}

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data as any;
    const code = data?.code;
    const message: string | undefined = data?.message;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 재시도 루프 방지
    if (original?._retry) throw error;

    // 재발급 엔드포인트/로그아웃 등은 건너뛰기(보호)
    const url = (original?.url || "").toString();
    if (url.includes("/api/auth/reissue") || url.includes("/api/auth/logout")) {
      throw error;
    }

    // 만료/무효 신호에만 재발급
    const isAccessTokenInvalidByCode =
      code === "TOKEN4001" || // 백엔드가 access 만료에 쓰는 코드
      code === "INVALID_JWT_ACCESS_TOKEN"; // JwtTokenProvider에서 던지는 커스텀 코드 가능성

    const isAccessTokenInvalidByMessage =
      typeof message === "string" &&
      message.includes("유효하지 않은 AccessToken입니다");

    const shouldTry =
      status === 401 &&
      (isAccessTokenInvalidByCode || isAccessTokenInvalidByMessage);

    if (!shouldTry) throw error;

    // === 재발급 동시성 제어 (기존 로직 유지) ===
    if (!isRefreshing) {
      isRefreshing = true;
      const ok = await refreshAccessToken();
      isRefreshing = false;
      waiters.forEach((cb) => cb(ok));
      waiters = [];
      if (!ok) {
        window.location.href = "/";
        throw error;
      }
    } else {
      const ok = await new Promise<boolean>((resolve) => waiters.push(resolve));
      if (!ok) {
        window.location.href = "/";
        throw error;
      }
    }

    // 리프레시 성공 → 원 요청 재시도 (CSRF 재주입)
    original._retry = true;
    // const csrf = getCookieValue("XSRF-TOKEN");
    // if (csrf) {
    //   const h = ensureAxiosHeaders(original.headers as AxiosRequestHeaders);
    //   h.set("X-XSRF-TOKEN", csrf);
    //   original.headers = h;
    // }
    return axiosInstance(original);
  }
);
