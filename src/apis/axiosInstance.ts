import axios, {
	AxiosHeaders,
	AxiosError,
	type InternalAxiosRequestConfig,
} from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	xsrfCookieName: "XSRF-TOKEN",   // 서버가 심는 쿠키명
	xsrfHeaderName: "X-XSRF-TOKEN", // axios가 자동으로 붙일 헤더명(문서 기준)
});

// ── 요청 인터셉터 ─────────────────────────────────────────────
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const h = new AxiosHeaders(config.headers ?? {});
	h.set("X-DEBUG-INSTANCE", "main-axiosInstance");

	// axios가 자동 세팅한 X-XSRF-TOKEN 값을 X-CSRF-TOKEN으로도 복제(서버가 이쪽만 읽는 경우 대비)
	const xsrf = h.get("X-XSRF-TOKEN") || h.get("x-xsrf-token");
	if (xsrf) h.set("X-CSRF-TOKEN", String(xsrf));

	// FormData일 땐 Content-Type 수동 설정 금지(브라우저가 boundary 포함해 자동 지정)
	if (typeof FormData !== "undefined" && config.data instanceof FormData) {
		h.delete("Content-Type");
	}

	config.headers = h;
	return config;
});

// ── 액세스 토큰 재발급 + 최신 CSRF 확보 ─────────────────────────
async function refreshAccessToken(): Promise<boolean> {
	try {
		await axiosInstance.post("/api/auth/reissue", null);
		await axiosInstance.get("/csrf"); // 새 세션/토큰 기준으로 XSRF-TOKEN 갱신
		return true;
	} catch {
		return false;
	}
}

let refreshing = false;
let waiters: Array<(ok: boolean) => void> = [];

// ── 응답 인터셉터: 인증/CSRF 오류 시 재발급 → 원요청 재시도 ─────────────
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