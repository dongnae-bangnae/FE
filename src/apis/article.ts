import { axiosInstance } from "./axiosInstance";
import { ApiResponse } from "../types/common";
import { ArticleForm, ArticleDetail, LikeResponse } from "../types/article";

/** FormData */
const toFormData = (form: ArticleForm) => {
  const formData = new FormData();

  formData.append("categoryId", String(form.categoryId));
  formData.append("placeId", String(form.placeId));
  formData.append("regionId", String(form.regionId));
  formData.append("title", form.title);
  formData.append("content", form.content);
  formData.append("date", form.date);
  // formData.append("placeName", form.placeName);
  // formData.append("pinCategory", form.pinCategory);

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
  const { data: response } = await axiosInstance.post<ApiResponse<{ articleId: number }>>(
    "/api/articles",
    formData
  );
  return response.result.articleId;
};

//게시글 수정
// export const editArticle = async (articleId: number, data: ArticleForm): Promise<void> => {
//   const formData = toFormData(data);
//   await axiosInstance.patch(`/api/articles/${articleId}`, formData);
// };

//게시글 삭제
// export const deleteArticle = async (articleId: number): Promise<void> => {
//   await axiosInstance.delete(`/api/articles/${articleId}`);
// };

//게시글 상세 조회
export const fetchArticleDetail = async (articleId: number): Promise<ArticleDetail> => {
  const { data } = await axiosInstance.get<ApiResponse<ArticleDetail>>(`/api/articles/${articleId}`);
  return data.result;
};

//좋아요 등록
export const likeArticle = async (articleId: number): Promise<LikeResponse> => {
  const { data } = await axiosInstance.post<ApiResponse<LikeResponse>>(`/api/articles/${articleId}/likes`);
  return data.result;
};

//좋아요 취소
export const unlikeArticle = async (articleId: number): Promise<LikeResponse> => {
  const { data } = await axiosInstance.delete<ApiResponse<LikeResponse>>(`/api/articles/${articleId}/likes`);
  return data.result;
};

//신고 등록
export const reportSpam = async (articleId: number): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/spams`);
  return response.data;
};