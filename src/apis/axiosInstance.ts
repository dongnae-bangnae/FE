// src/apis/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  type AxiosRequestHeaders
} from "axios";

/** 쿠키 읽기 (HttpOnly 쿠키는 읽히지 않음) */
function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? m[2] : null;
}

/** headers를 AxiosHeaders 인스턴스로 보장 */
function ensureAxiosHeaders(
  headers?: AxiosRequestHeaders | undefined
): AxiosHeaders {
  if (headers instanceof AxiosHeaders) return headers;
  return new AxiosHeaders(headers ?? {});
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN"
});

/* ------------------- 요청: CSRF 헤더 자동 주입 + 디버그 헤더 ------------------- */
axiosInstance.interceptors.request.use((config) => {
  const h = ensureAxiosHeaders(config.headers as AxiosRequestHeaders);

  // 디버그 라벨
  h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

  // CSRF 토큰 처리 개선
  const csrf = getCookieValue("XSRF-TOKEN");
  if (csrf) {
    h.set("X-XSRF-TOKEN", csrf);
    console.log("CSRF Token found and set:", csrf); // 디버깅용
  } else {
    console.warn("No CSRF token found in cookies"); // 디버깅용
  }

  // FormData일 때는 Content-Type을 자동으로 설정하도록 하고
  // 다른 헤더는 그대로 유지
  if (config.data instanceof FormData) {
    // FormData의 경우 브라우저가 자동으로 Content-Type을 설정하도록 해야 함
    // boundary를 포함한 정확한 Content-Type이 설정됨
    h.delete("Content-Type");
  }

  config.headers = h;
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
    return true;
  } catch {
    return false;
  }
}

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const code = (error.response?.data as any)?.code;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // CSRF 에러 로깅 추가
    if (status === 403) {
      console.error("403 Forbidden Error:", error.response?.data);
      console.log("Request headers:", original.headers);
      console.log("CSRF Token in cookie:", getCookieValue("XSRF-TOKEN"));
    }

    if (original?._retry) throw error;

    const shouldTry =
      status === 401 ||
      status === 403 ||
      code === "TOKEN4001" ||
      code === "TOKEN4002";

    if (!shouldTry) throw error;

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

    // 리프레시 성공 → 원 요청 재시도
    original._retry = true;
    const csrf = getCookieValue("XSRF-TOKEN");
    if (csrf) {
      const h = ensureAxiosHeaders(original.headers as AxiosRequestHeaders);
      h.set("X-XSRF-TOKEN", csrf);

      // FormData 재시도 시에도 Content-Type 처리
      if (original.data instanceof FormData) {
        h.delete("Content-Type");
      }

      original.headers = h;
    }
    return axiosInstance(original);
  }
);
