import { axiosInstance } from "./axiosInstance";

export const patchNickname = async (nickname: string) => {
  const response = await axiosInstance.patch(
    "api/member/nickname",
    { nickname },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
};

export const patchRegions = async (regionIds: number[]) => {
  const response = await axiosInstance.patch(
    "api/member/regions",
    { regionIds },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
};
