import { axiosInstance } from "./axiosInstance";

export const fetchDefaultImages = async (): Promise<string[]> => {
  const res = await axiosInstance.get("/api/default-images"); //경로수정
  const data = res.data;

  if (Array.isArray(data)) return data;           
  if (Array.isArray(data?.result)) return data.result; 

  console.warn("[default-images] Unexpected response:", data);
  return []; // React Query에서 undefined 에러 방지
};
