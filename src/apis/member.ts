import { axiosInstance } from "./axiosInstance";

export const patchNickname = async (nickname: string) => {
  const response = await axiosInstance.patch(
    "/member/nickname",
    { nickname },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
};
