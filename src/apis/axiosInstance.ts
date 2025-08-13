// src/apis/axiosInstance.ts
import axios, { AxiosHeaders, AxiosError, type InternalAxiosRequestConfig } from "axios";

/** 공용 Axios 인스턴스 */
export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,          // 쿠키 동봉
	xsrfCookieName: "XSRF-TOKEN",   // 서버 쿠키명
	xsrfHeaderName: "X-XSRF-TOKEN", // 문서 명세에 맞춤
});

/** 요청 인터셉터: 디버그 헤더, FormData면 Content-Type 제거 */
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const h = new AxiosHeaders(config.headers ?? {});
	h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

	// FormData일 땐 Content-Type을 브라우저가 boundary 포함해 자동 설정하도록 둔다.
	if (config.data instanceof FormData) {
		h.delete("Content-Type");
	}
	config.headers = h;
	return config;
});

/** 액세스 토큰 재발급 + 최신 CSRF 재취득 */
async function refreshAccessToken(): Promise<boolean> {
	try {
		// 재발급도 같은 인스턴스로 -> xsrf 자동 부착
		await axiosInstance.post("/api/auth/reissue", null);
		// 새 세션/토큰 기준으로 XSRF-TOKEN 쿠키 갱신
		await axiosInstance.get("/csrf");
		return true;
	} catch {
		return false;
	}
}

/** 동시 재발급 제어 (선택: 단순화 버전이면 생략 가능) */
let refreshing = false;
let waiters: Array<(ok: boolean) => void> = [];

/** 응답 인터셉터: 인증/CSRF 오류 시 재발급 → 원요청 재시도 */
axiosInstance.interceptors.response.use(
	(res) => res,
	async (error: AxiosError<any>) => {
		const status = error.response?.status;
		const code = error.response?.data?.code as string | undefined;
		const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

		if (original?._retry) throw error;

		const shouldTry =
			status === 401 ||
			status === 403 ||
			code === "TOKEN4001" || // access 만료
			code === "TOKEN4002" || // refresh 필요
			code === "TOKEN4004";   // invalid CSRF

		if (!shouldTry) throw error;

		// 동시 요청 큐 처리
		if (!refreshing) {
			refreshing = true;
			const ok = await refreshAccessToken();
			refreshing = false;
			waiters.forEach((w) => w(ok));
			waiters = [];
			if (!ok) {
				window.location.href = "/"; // 로그인 등 시작점으로
				throw error;
			}
		} else {
			const ok = await new Promise<boolean>((resolve) => waiters.push(resolve));
			if (!ok) {
				window.location.href = "/";
				throw error;
			}
		}

		// 재시도
		original._retry = true;
		return axiosInstance(original);
	}
);

/* ===================================================================== */
/* 편의 함수 예시: 온보딩(JSON 전송)                                     */
/* ===================================================================== */

export interface OnboardingPayload {
	nickname: string;
	chosenRegionIds: number[]; // 최소 1, 최대 3
}

/** 온보딩 호출 전 최신 CSRF 보장 + JSON 전송 */
export async function postOnboarding(payload: OnboardingPayload) {
	// 혹시 모를 세션/로드밸런서 이슈 대비해 직전 CSRF 프리플라이트
	await axiosInstance.get("/csrf");
	return axiosInstance.post("/api/member/onboarding", payload);
}
