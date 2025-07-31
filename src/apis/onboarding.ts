import { axiosInstance } from "./axiosInstance";

export const postOnboarding = async (data: FormData) => {
  const response = await axiosInstance.post("/api/member/onboarding", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
