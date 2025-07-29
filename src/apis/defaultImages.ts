import { axiosInstance } from "./axiosInstance";

export interface DefaultImage {
  uuid: string;
}

export const fetchDefaultImages = async (): Promise<DefaultImage[]> => {
  const res = await axiosInstance.get("/api/default-images");
  
  if (!res.data || !Array.isArray(res.data.result)) {
    return [];
  }

  return res.data.result;
};

export const getDefaultImageUrl = (uuid: string) =>
  `https://dnbn-bucket.s3.ap-northeast-2.amazonaws.com/default-images/${uuid}`;
