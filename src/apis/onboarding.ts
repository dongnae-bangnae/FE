import { axiosInstance } from "./axiosInstance";

const getCookie = (k: string) =>
  document.cookie.match(new RegExp("(^| )" + k + "=([^;]+)"))?.[2] ?? null;

export const postOnboarding = async (data: FormData) => {

  const csrf = getCookie("XSRF-TOKEN");
  if (csrf && !data.has("_csrf")) data.append("_csrf", decodeURIComponent(csrf)); 

  if (!localStorage.getItem("accessToken")) {
    try {
      const r = await axiosInstance.post("/api/auth/reissue"); 
      const auth = r.headers?.authorization;
      if (auth?.startsWith("Bearer ")) {
        localStorage.setItem("accessToken", auth.slice(7));
      }
    } catch {}
  }

  const res = await axiosInstance.post("/api/member/onboarding", data); 
  return res.data;
};
