import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
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
  return new AxiosHeaders(headers ?? {});
}

const API = import.meta.env.VITE_API_BASE_URL;

/**
 * ✅ 백엔드 수정 없이 CSRF를 최신으로 맞추기 위한 "인증된 GET" 폴백
 * - 이미 존재하는 내 정보 조회 API 사용
 */
const CSRF_GET_FALLBACKS = ["/api/member/info"];

/** 간단한 sleep */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true, // JWT/refresh/JSESSIONID/XSRF 쿠키 전송
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN"
});

/** (프론트만으로) XSRF 쿠키를 가능한 최신으로 맞춘다 */
async function ensureFreshCsrfViaFallback(): Promise<string | null> {
  // 1) 우선 쿠키에 있으면 사용
  let csrf = getCookieValue("XSRF-TOKEN");
  if (csrf) return csrf;

  // 2) 리프레시 직후 Set-Cookie 반영 지연 대비 (최대 300ms 대기)
  for (let i = 0; i < 3; i++) {
    await sleep(100);
    csrf = getCookieValue("XSRF-TOKEN");
    if (csrf) return csrf;
  }

  // 3) 그래도 없으면, 인증된 GET을 호출해 서버가 쿠키를 세팅/갱신하도록 유도
  for (const path of CSRF_GET_FALLBACKS) {
    try {
      await axios.get(`${API}${path}`, { withCredentials: true });
      await sleep(50);
      csrf = getCookieValue("XSRF-TOKEN");
      if (csrf) return csrf;
    } catch {
      // 404/401 등은 무시하고 다음 후보 시도
    }
  }

  // 4) 실패 시 null
  return null;
}

/* ------------------- 요청 인터셉터: CSRF 자동 주입 + 디버그 ------------------- */
axiosInstance.interceptors.request.use(async (config) => {
  const h = ensureAxiosHeaders(config.headers as AxiosRequestHeaders);

  // 디버그 라벨(이 인스턴스에서 나간 요청 식별)
  h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

  // 쿠키에 없으면 폴백 로직으로 확보 시도
  let csrf = getCookieValue("XSRF-TOKEN");
  if (!csrf) csrf = await ensureFreshCsrfViaFallback();
  if (csrf) h.set("X-XSRF-TOKEN", csrf);

  config.headers = h;
  return config;
});

/* ------------------- 응답 인터셉터: 토큰 리프레시 + CSRF 확보 후 재시도 ------------------- */
let isRefreshing = false;
let waiters: Array<(ok: boolean) => void> = [];

async function refreshAccessToken(): Promise<boolean> {
  try {
    await axios.post(`${API}/api/auth/reissue`, null, {
      withCredentials: true
    });
    return true; // 서버가 Set-Cookie로 새 accessToken 내려줌
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

    // 이미 한 번 재시도했다면 더 이상 반복 방지
    if (original?._retry) throw error;

    const shouldTry =
      status === 401 ||
      status === 403 ||
      code === "TOKEN4001" ||
      code === "TOKEN4002";

    if (!shouldTry) throw error;

    // 액세스 토큰 리프레시(중복 호출 동기화)
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

    // 리프레시 직후: XSRF 최신값을 "프론트만으로" 확보
    const fresh = await ensureFreshCsrfViaFallback();

    // 원 요청 재시도 (가능하면 최신 CSRF 재주입)
    original._retry = true;
    if (fresh) {
      const h = ensureAxiosHeaders(original.headers as AxiosRequestHeaders);
      h.set("X-XSRF-TOKEN", fresh);
      original.headers = h;
    }
    return axiosInstance(original);
  }
);
