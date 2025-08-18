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

//게시글 작성
export const createArticle = async (data: ArticleForm): Promise<number> => {
  const formData = toFormData(data);
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

//  V2 복합 커서 타입
export type PlaceCursor = {
  cursorCreatedAt: string | null;
  cursorArticleId: number | null;
};

// GET /api/articles/
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

// GET /api/articles/v2
export async function fetchArticlesByPlaceV2(
  placeId: number,
  cursor?: PlaceCursor | null, // 첫 페이지면 null/undefined
  limit: number = 10
): Promise<{
  items: PlaceArticleRow[];
  nextCursor: PlaceCursor | null;
  hasNext: boolean;
  limit: number;
}> {
  const params: Record<string, any> = { placeId, limit };

  // 첫 페이지가 아니면 커서 2개를 함께 전송
  if (cursor?.cursorCreatedAt) params.cursorCreatedAt = cursor.cursorCreatedAt;
  if (cursor?.cursorArticleId != null)
    params.cursorArticleId = cursor.cursorArticleId;

  const { data } = await axiosInstance.get("/api/articles/v2", { params });

  // 응답: result가 배열(리스트) — 스웨거 예시와 동일
  const items: PlaceArticleRow[] = Array.isArray(data?.result)
    ? data.result
    : [];

  // 다음 페이지용 복합 커서 생성 (마지막 아이템 기준)
  const last = items[items.length - 1];

  return {
    items,
    nextCursor: last
      ? { cursorCreatedAt: last.createdAt, cursorArticleId: last.articleId }
      : null,
    hasNext: items.length === limit,
    limit
  };
}
