import { axiosInstance } from "./axiosInstance";

export const patchNickname = async (nickname: string) => {
  const response = await axiosInstance.patch("/api/member/nickname", {
    nickname
  });
  return response.data;
};
