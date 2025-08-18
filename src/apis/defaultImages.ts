// src/apis/defaultImages.ts
import { axiosInstance } from "./axiosInstance";

const S3_BASE = "https://dnbn-bucket.s3.ap-northeast-2.amazonaws.com";
const DEFAULT_IMAGES_BASE = `${S3_BASE}/default-images`;

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

//기본이미지목록
export const fetchDefaultImages = async (): Promise<string[]> => {
  const res = await axiosInstance.get("/api/default-images");
  const data = res.data;

  const rawList: string[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.result)
    ? data.result
    : [];

  // [DEFAULT-IMAGES] => default-images/{uuid}로 통일해 반환(작성 화면에서 바로 표시용)
  return rawList.map((s) => `${DEFAULT_IMAGES_BASE}/${extractUuid(s)}`);
};
