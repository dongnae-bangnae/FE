import { ArticleDetail, ArticleForm, LikeResponse } from "../types/article";
import { ArticleListItem } from "../types/article";
import { ApiResponse } from "../types/common";
import { axiosInstance } from "./axiosInstance";

// 게시글 리스트 조회용 타입
export interface Article {
  articleId: number;
  pinCategory: string;
  imageUrl: string;
  title: string;
  likes: number;
  spam: number;
  comments: number;
}

export interface ArticleListResponse {
  articles: Article[];
  cursor: number;
  limit: number;
  hasNext: boolean;
}

export const fetchCategoryArticles = async (
  categoryId: number,
  cursor?: number,
  limit: number = 10
): Promise<ArticleListResponse> => {
  const params: Record<string, any> = { limit };

  // cursor가 0이 아니고, 명시된 경우에만 추가
  if (cursor !== undefined && cursor !== null && cursor !== 0) {
    params.cursor = cursor;
  }

  console.log("최종 요청 파라미터:", params);

  const { data } = await axiosInstance.get<ApiResponse<ArticleListResponse>>(
    `/api/categories/${categoryId}/articles`,
    { params }
  );
  return data.result;
};

/** FormData */
const toFormData = (form: ArticleForm) => {
  const formData = new FormData();

  formData.append("categoryId", String(form.categoryId));
  // formData.append("placeId", String(form.placeId));
  formData.append("regionId", String(form.regionId));
  formData.append("title", form.title);
  formData.append("content", form.content);
  formData.append("date", form.date);
  formData.append("latitude", String(form.latitude));
  formData.append("longitude", String(form.longitude));
  formData.append("detailAddress", form.detailAddress);
  formData.append("placeName", form.placeName);
  formData.append("pinCategory", form.pinCategory);

  if (form.mainImageUuid) {
    formData.append("mainImageUuid", form.mainImageUuid);
    console.log("main 추가: ", form.mainImageUuid);
  }

  form.imageUuids.forEach((uuid) => {
    formData.append("imageUuids", uuid);
    console.log("나머지 추가: ", form.imageUuids);
  });

  return formData;
};

// dataURL -> File
function dataUrlToFile(dataUrl: string, fileName: string) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const bin = atob(base64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new File([u8], fileName, { type: mime });
}

// http(s) URL -> File
async function urlToFile(url: string, fileName: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch image: " + url);
  const blob = await res.blob();
  const type = blob.type || "image/jpeg";
  return new File([blob], fileName, { type });
}

async function toCreateMultipart(form: ArticleForm) {
  const fd = new FormData();

  const requestPayload = {
    categoryId: form.categoryId,
    regionId: form.regionId,
    title: form.title,
    content: form.content,
    date: form.date,             
    latitude: form.latitude,
    longitude: form.longitude,
    detailAddress: form.detailAddress,
    placeName: form.placeName,
    pinCategory: form.pinCategory 
  };

  fd.append(
    "request",
    new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
  );

  // 대표 이미지
  if (form.mainImageUuid) {
    const mainFile = form.mainImageUuid.startsWith("data:")
      ? dataUrlToFile(form.mainImageUuid, "main.jpg")
      : await urlToFile(form.mainImageUuid, "main.jpg");
    fd.append("mainImage", mainFile);
  }

  // 나머지 이미지
  for (let i = 0; i < form.imageUuids.length; i++) {
    const src = form.imageUuids[i];
    try {
      const file = src.startsWith("data:")
        ? dataUrlToFile(src, `img_${i}.jpg`)
        : await urlToFile(src, `img_${i}.jpg`);
      fd.append("imageFiles", file);
    } catch (e) {
      console.warn("skip image due to fetch/CORS:", src, e);
    }
  }

  return fd;
}


//게시글 작성
export const createArticle = async (data: ArticleForm): Promise<number> => {
  const formData = await toCreateMultipart(data);

   for (const [k, v] of formData.entries()) {
    console.log(
      "[createArticle] FormData",
      k,
      v instanceof File ? `File(${v.name}, ${v.type}, ${v.size}B)` : v
    );
  }

  const { data: response } = await axiosInstance.post<
    ApiResponse<{ articleId: number }>
  >("/api/articles/with-location", formData);

  return response.result.articleId;
};

//게시글 수정
export const editArticle = async (
  articleId: number,
  data: ArticleForm
): Promise<void> => {
  const formData = toFormData(data);
  await axiosInstance.put(`/api/articles/${articleId}`, formData);
};

//게시글 삭제
export const deleteArticle = async (articleId: number): Promise<void> => {
  await axiosInstance.delete(`/api/articles/${articleId}`);
};

//게시글 상세 조회
export const fetchArticleDetail = async (
  articleId: number
): Promise<ArticleDetail> => {
  const { data } = await axiosInstance.get<ApiResponse<ArticleDetail>>(
    `/api/articles/${articleId}`
  );
  return data.result;
};

//좋아요 등록
export const likeArticle = async (articleId: number): Promise<LikeResponse> => {
  const { data } = await axiosInstance.post<ApiResponse<LikeResponse>>(
    `/api/articles/${articleId}/likes`
  );
  return data.result;
};

//좋아요 취소
export const unlikeArticle = async (
  articleId: number
): Promise<LikeResponse> => {
  const { data } = await axiosInstance.delete<ApiResponse<LikeResponse>>(
    `/api/articles/${articleId}/likes`
  );
  return data.result;
};

//신고 등록
export const reportSpam = async (
  articleId: number
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/spams`);
  return response.data;
};

//신고 취소
export const unreportSpam = async (
  articleId: number
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete(
    `/api/articles/${articleId}/spams`
  );
  return response.data;
};

export async function fetchArticles(cursor = 0, limit = 10) {
  const { data } = await axiosInstance.get("/api/articles", {
    params: { cursor, limit }
  });
  // 안전가드
  const list: ArticleListItem[] = Array.isArray(data?.result)
    ? data.result
    : [];
  return { articles: list, cursor, limit };
}

// GET /api/articles?placeId&cursor&limit (단일 커서 Long 방식)
export type PlaceArticleRow = {
  memberId: number;
  articleId: number;
  regionId: number;
  placeId: number;
  nickname: string;
  title: string;
  pinCategory: string;
  mainImageUuid: string | null;
  likeCount: number;
  spamCount: number;
  commentCount: number;
  isLiked: boolean;
  isSpammed: boolean;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchArticlesByPlace(
  placeId: number,
  cursor?: number | null, // null/-1 => 첫 페이지로 간주
  limit: number = 10
): Promise<{
  items: PlaceArticleRow[];
  nextCursor: number | null;
  hasNext: boolean;
  limit: number;
}> {
  const params: Record<string, any> = { placeId, limit };

  // 명세서 상: cursor가 null 이거나 -1이면 첫 페이지
  if (cursor !== undefined && cursor !== null && cursor !== -1) {
    params.cursor = cursor;
  }

  const { data } = await axiosInstance.get("/api/articles", { params });

  // 안전 가드: result가 배열이라는 가정
  const items: PlaceArticleRow[] = Array.isArray(data?.result)
    ? data.result
    : [];

  // 다음 커서/hasNext 유추 (서버에서 명시 안 주면 마지막 articleId 기준)
  const nextCursor = items.length ? items[items.length - 1].articleId : null;
  const hasNext = items.length === limit;

  return { items, nextCursor, hasNext, limit };
}
