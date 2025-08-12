// src/apis/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosHeaders,
  type AxiosRequestHeaders
} from "axios";

/** 쿠키 읽기 (HttpOnly 쿠키는 읽히지 않음) */
function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
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
  withCredentials: true, // JWT/refresh/JSESSIONID 쿠키 전송
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN"
});

/* ------------------- 요청: CSRF 헤더 자동 주입 ------------------- */
axiosInstance.interceptors.request.use((config) => {
  const csrf = getCookieValue("XSRF-TOKEN");
  if (csrf) {
    const h = ensureAxiosHeaders(config.headers as AxiosRequestHeaders);
    h.set("X-XSRF-TOKEN", csrf);
    config.headers = h; // ← 타입 OK
  }
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
    const code = (error.response?.data as any)?.code;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

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

    // 리프레시 성공 → 원 요청 재시도 (CSRF 재주입)
    original._retry = true;
    const csrf = getCookieValue("XSRF-TOKEN");
    if (csrf) {
      const h = ensureAxiosHeaders(original.headers as AxiosRequestHeaders);
      h.set("X-XSRF-TOKEN", csrf);
      original.headers = h;
    }
    return axiosInstance(original);
  }
);
