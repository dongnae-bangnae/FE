import { ArticleDetail, ArticleForm, LikeResponse, CreatedArticleResult } from "../types/article";
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

  if (form.mainImageUuid) formData.append("mainImageUuid", form.mainImageUuid);
  (form.imageUuids ?? []).forEach((uuid) => formData.append("imageUuids", uuid));

  return formData;
};

export type ArticleFormAtPlace = Omit<ArticleForm, "latitude" | "longitude"> & {
  placeId: number; // 기존 핀: placeId 필수
};

const toFormDataAtPlace = (form: ArticleFormAtPlace) => {
  const fd = new FormData();

  // 공통 필드
  fd.append("categoryId", String(form.categoryId));
  fd.append("regionId", String(form.regionId));
  fd.append("title", form.title);
  fd.append("content", form.content);
  fd.append("date", form.date);
  fd.append("detailAddress", form.detailAddress);
  fd.append("placeName", form.placeName);
  fd.append("pinCategory", form.pinCategory);

  // 기존 핀 식별
  fd.append("placeId", String(form.placeId));

  if (form.mainImageUuid) fd.append("mainImageUuid", form.mainImageUuid);
  (form.imageUuids ?? []).forEach((uuid) => fd.append("imageUuids", uuid));

  return fd;
};

const jsonPart = (obj: unknown) =>
  new Blob([JSON.stringify(obj)], { type: "application/json" });

function pickMainAndOthers(files: (File | undefined)[], mainIndex?: number) {
  const safe = (files ?? []).filter((f): f is File => f instanceof File);
  if (safe.length === 0) return { main: undefined as File | undefined, others: [] as File[] };
  let idx = typeof mainIndex === "number" ? mainIndex : 0;
  idx = Math.min(Math.max(idx, 0), safe.length - 1);
  const main = safe[idx];
  const others = safe.filter((_, i) => i !== idx);
  return { main, others };
}

const toPartialFormData = (form: Partial<ArticleForm>) => {
  const fd = new FormData();

  const put = (k: keyof ArticleForm, v: any) => {
    if (v !== undefined && v !== null && v !== "") {
      fd.append(String(k), String(v));
    }
  };

  put("categoryId", form.categoryId);
  put("regionId", form.regionId);
  put("title", form.title);
  put("content", form.content);
  put("date", form.date);
  put("latitude", form.latitude);   
  put("longitude", form.longitude); 
  put("detailAddress", form.detailAddress);
  put("placeName", form.placeName);
  put("pinCategory", form.pinCategory);
  put("mainImageUuid", form.mainImageUuid);

  if (form.imageUuids) {
    form.imageUuids.forEach((uuid) => fd.append("imageUuids", uuid));
  }
  return fd;
};

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function authHeader() {
  const token = getCookie("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

//게시글 작성(미등록장소)
export const createArticle = async (
  data: ArticleForm,
  opts?: { files?: File[]; mainIndex?: number }
): Promise<CreatedArticleResult> => {
  const fd = new FormData();

  const request: any = {
    categoryId: data.categoryId,
    regionId: data.regionId,
    title: data.title,
    content: data.content,
    date: data.date,
    latitude: data.latitude,
    longitude: data.longitude,
    detailAddress: data.detailAddress,
    placeName: data.placeName,
    pinCategory: data.pinCategory,
  };

  if (data.mainImageUuid) request.mainImageUuid = data.mainImageUuid; // UUID만
  if (Array.isArray(data.imageUuids) && data.imageUuids.length) {
    request.imageUuids = data.imageUuids; // UUID 배열
  }

  fd.append("request", jsonPart(request));

  const { main, others } = pickMainAndOthers(opts?.files ?? [], opts?.mainIndex);
  if (main) fd.append("mainImage", main);
  others.forEach((f) => fd.append("imageFiles", f));

  const { data: res } = await axiosInstance.post("/api/articles/with-location", fd);
  return res.result as CreatedArticleResult;
};

//게시글 작성(기존 핀)
export const createArticleAtPlace = async (
  data: Omit<ArticleForm, "latitude" | "longitude"> & { placeId: number },
  opts?: { files?: File[]; mainIndex?: number }
): Promise<CreatedArticleResult> => {
  const fd = new FormData();

  const request: any = {
    categoryId: data.categoryId,
    placeId: data.placeId,
    regionId: data.regionId,
    title: data.title,
    content: data.content,
    date: data.date,
    detailAddress: data.detailAddress,
    placeName: data.placeName,
    pinCategory: data.pinCategory,
  };

  if (data.mainImageUuid) request.mainImageUuid = data.mainImageUuid;
  if (Array.isArray(data.imageUuids) && data.imageUuids.length) {
    request.imageUuids = data.imageUuids;
  }

  fd.append("request", jsonPart(request));

  const { main, others } = pickMainAndOthers(opts?.files ?? [], opts?.mainIndex);
  if (main) fd.append("mainImage", main);
  others.forEach((f) => fd.append("imageFiles", f));

  const { data: res } = await axiosInstance.post("/api/articles", fd);
  return res.result as CreatedArticleResult;
};

//게시글 수정
export const editArticle = async (
  articleId: number,
  data: Partial<ArticleForm>
): Promise<void> => {
  const formData = toPartialFormData(data);
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
    `/api/articles/${articleId}/likes`,
    null,
    {
      withCredentials: true,           
      headers: authHeader(),       
    }
  );
  return data.result;
};

//좋아요 취소
export const unlikeArticle = async (
  articleId: number
): Promise<LikeResponse> => {
  const { data } = await axiosInstance.delete<ApiResponse<LikeResponse>>(
    `/api/articles/${articleId}/likes`,
    {
      withCredentials: true,          
      headers: authHeader(),        
    }
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