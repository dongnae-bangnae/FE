import { axiosInstance } from "./axiosInstance";

export interface DefaultImage {
  uuid: string;
}

export const fetchDefaultImages = async (): Promise<string[]> => {
  const res = await axiosInstance.get("/api/default-images");
  // console.log("default Image:", res.data);
  
  if (!Array.isArray(res.data)) return [];

  return res.data;
};
