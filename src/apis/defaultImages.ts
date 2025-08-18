import { axiosInstance } from "./axiosInstance";

const S3_BASE = "https://dnbn-bucket.s3.ap-northeast-2.amazonaws.com"; 
const ARTICLE_PHOTO_BASE = `${S3_BASE}/article/photo`;                 

function extractUuid(input: string): string {
  try {
    const url = new URL(input);
    const last = url.pathname.split("/").filter(Boolean).pop() || "";
    return last.split("?")[0];
  } catch {
    const last = input.split("/").filter(Boolean).pop() || "";
    return last.split("?")[0];
  }
}

export const fetchDefaultImages = async (): Promise<string[]> => {
  const res = await axiosInstance.get("/api/default-images");
  const data = res.data;

  const rawList: string[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.result)
    ? data.result
    : [];

  return rawList.map((s) => `${ARTICLE_PHOTO_BASE}/${extractUuid(s)}`);
};
