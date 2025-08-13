// src/apis/axiosInstance.ts
import axios, { AxiosHeaders, AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN", // 문서대로
});

// 1) 요청 인터셉터
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const h = new AxiosHeaders(config.headers ?? {});
	h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

	// A. axios가 자동으로 넣은 X-XSRF-TOKEN 값을 X-CSRF-TOKEN으로도 복제
	const xsrf = h.get("X-XSRF-TOKEN") || h.get("x-xsrf-token");
	if (xsrf) h.set("X-CSRF-TOKEN", String(xsrf));

	// B. FormData면 Content-Type 강제 금지
	if (typeof FormData !== "undefined" && config.data instanceof FormData) {
		h.delete("Content-Type");
		// 🔒 가능하면 여기서 경고만 띄우고, 실제 온보딩 호출부는 JSON으로 바꿔.
		// console.warn("[onboarding] FormData detected. Prefer JSON payload.");
	}

	config.headers = h;
	return config;
});

// 2) 재발급 + 최신 CSRF
async function refreshAccessToken(): Promise<boolean> {
	try {
		await axiosInstance.post("/api/auth/reissue", null);
		await axiosInstance.get("/csrf");
		return true;
	} catch {
		return false;
	}
}

let refreshing = false;
let waiters: Array<(ok: boolean) => void> = [];

// 3) 응답 인터셉터
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
			code === "TOKEN4001" ||
			code === "TOKEN4002" ||
			code === "TOKEN4004";

		if (!shouldTry) throw error;

		if (!refreshing) {
			refreshing = true;
			const ok = await refreshAccessToken();
			refreshing = false;
			waiters.forEach((w) => w(ok));
			waiters = [];
			if (!ok) { window.location.href = "/"; throw error; }
		} else {
			const ok = await new Promise<boolean>((resolve) => waiters.push(resolve));
			if (!ok) { window.location.href = "/"; throw error; }
		}

		original._retry = true;
		return axiosInstance(original);
	}
);

// ✅ 온보딩은 JSON으로 (호출부 예시)
export async function postOnboarding(payload: { nickname: string; chosenRegionIds: number[] }) {
	// 직전 CSRF 확보
	await axiosInstance.get("/csrf");
	// JSON 전송 (FormData 쓰지 말기)
	return axiosInstance.post("/api/member/onboarding", payload, {
		headers: new AxiosHeaders({ "Content-Type": "application/json" }),
	});
}
