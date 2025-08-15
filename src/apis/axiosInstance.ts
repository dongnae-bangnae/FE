// src/apis/axiosInstance.ts
import axios, {
	AxiosError,
	AxiosRequestConfig,
	AxiosHeaders,
	type AxiosRequestHeaders
} from "axios";

/** 쿠키 읽기 (HttpOnly면 JS로 안 보임) */
function getCookieValue(name: string): string | null {
	const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
	return m ? decodeURIComponent(m[2]) : null;
}

/** headers를 AxiosHeaders 인스턴스로 보장 */
function ensureAxiosHeaders(headers?: AxiosRequestHeaders | undefined): AxiosHeaders {
	if (headers instanceof AxiosHeaders) return headers;
	return new AxiosHeaders(headers ?? {});
}

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true
});

// ====== [추가] 인증 헤더 주입 ======
function pickAccessToken(): string | null {
	// 1) 쿠키 우선 (쿠키에만 보관하는 설계라면 여기서만 나옴)
	const fromCookie = getCookieValue("accessToken");
	if (fromCookie) return fromCookie;

	// 2) 로컬스토리지/세션스토리지/상태 저장소 등 보조 경로
	const fromLs = localStorage.getItem("accessToken");
	if (fromLs) return fromLs;

	// 3) 없으면 null
	return null;
}

/* ------------------- 요청 인터셉터 ------------------- */
axiosInstance.interceptors.request.use((config) => {
	const h = ensureAxiosHeaders(config.headers as AxiosRequestHeaders);

	// 디버그 라벨
	h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

	// 공개 엔드포인트면 스킵하고 싶다면 여기서 필터링 가능
	const url = (config.url || "").toString();
	const isAuthFree =
		url.includes("/api/auth/") || // 로그인/재발급/로그아웃 계열
		url.includes("/health") || url.includes("/public");

	if (!isAuthFree) {
		const token = pickAccessToken();
		if (token && token.trim() !== "") {
			h.set("Authorization", `Bearer ${token}`);
		} else {
			// 빈 Bearer가 나가지 않게 보장
			if ("Authorization" in h) h.delete("Authorization");
		}
	}

	config.headers = h;
	return config;
});
