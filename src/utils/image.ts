// src/utils/image.ts
import PlaceholderImg from "../assets/icon-article-basic.svg";

export const imageUrlFromUuid = (uuid?: string | null) => {
  if (!uuid) return PlaceholderImg; // 기본값: 로컬 SVG
  if (/^https?:\/\//i.test(uuid)) return uuid; // 이미 완전한 URL이면 그대로
  return `${import.meta.env.VITE_API_BASE_URL}/api/images/${uuid}`;
};
