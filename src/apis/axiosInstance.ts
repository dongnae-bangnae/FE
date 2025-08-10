import axios from "axios";

function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // JWT 쿠키 자동 포함
  xsrfCookieName: "XSRF-TOKEN", // BE가 내려주는 쿠키 이름
  xsrfHeaderName: "X-XSRF-TOKEN" // BE가 기대하는 헤더 이름
});

// 항상 최신 CSRF 쿠키값을 붙이기
axiosInstance.interceptors.request.use((config) => {
  const csrf = getCookieValue("XSRF-TOKEN");
  if (csrf) {
    config.headers = config.headers ?? {};
    config.headers["X-XSRF-TOKEN"] = csrf;
  }
  return config;
});
