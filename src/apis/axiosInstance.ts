import axios, { AxiosHeaders, } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN", // 문서에 맞춤
});


axiosInstance.interceptors.request.use((config) => {
  const h = new AxiosHeaders(config.headers ?? {});
  h.set("X-DEBUG-INSTANCE", "main-axiosInstance");
  if (config.data instanceof FormData) h.delete("Content-Type");
  config.headers = h;
  return config;
});


async function refreshAccessToken(): Promise<boolean> {
  try {
    await axiosInstance.post("/api/auth/reissue", null);
    await axiosInstance.get("/csrf");
    return true;
  } catch {
    return false;
  }
}

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const code = (error.response?.data as any)?.code;
    const original = error.config as any;
    if (original?._retry) throw error;

    const shouldTry = status === 401 || status === 403 ||
                      code === "TOKEN4001" || code === "TOKEN4002" || code === "TOKEN4004";
    if (!shouldTry) throw error;

    const ok = await (async () => {
      return await refreshAccessToken();
    })();

    if (!ok) { window.location.href = "/"; throw error; }

    original._retry = true;
    
    return axiosInstance(original);
  }
);
