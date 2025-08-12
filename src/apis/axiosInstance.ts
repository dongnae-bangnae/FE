import axios from "axios";

function getCookieValue(name: string): string | null {
	const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
	return m ? decodeURIComponent(m[2]) : null;
}

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN"
});

axiosInstance.interceptors.request.use((config) => {
	config.headers = config.headers ?? {};

	const jwt =
		localStorage.getItem("accessToken") ?? getCookieValue("accessToken");
	if (jwt) config.headers.Authorization = `Bearer ${jwt}`;

	return config;
});
