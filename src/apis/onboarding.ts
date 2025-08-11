import { axiosInstance } from "./axiosInstance";

export const postOnboarding = async (data: FormData) => {
  const res = await axiosInstance.post("/api/member/onboarding", data);
  return res.data;
};
