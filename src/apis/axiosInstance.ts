// apis/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true //  JWT 쿠키 자동 포함
});

//  CSRF 토큰을 localStorage에서 꺼내서 헤더에 자동으로 포함
axiosInstance.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem("XSRF-TOKEN");
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }
  return config;
});
