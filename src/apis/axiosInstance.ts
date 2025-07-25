import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
		"Content-Type": "application/json",
	},
})

// 임의로 토큰 동적으로 추가 (추후 수정 예정)
axiosInstance.interceptors.request.use((config) => {
	const token = import.meta.env.VITE_ACCESS_TOKEN;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});