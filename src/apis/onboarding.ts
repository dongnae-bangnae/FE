import { axiosInstance } from "./axiosInstance";

const getCookie = (k: string) =>
  document.cookie.match(new RegExp("(^| )" + k + "=([^;]+)"))?.[2] ?? null;

export const postOnboarding = async (data: FormData) => {
  const csrf = getCookie("XSRF-TOKEN");
  if (csrf && !data.has("_csrf")) data.append("_csrf", decodeURIComponent(csrf)); // ✅ 추가뉴
  const res = await axiosInstance.post("/api/member/onboarding", data); // Content-Type 수동 지정 X 뉴
  return res.data;
};