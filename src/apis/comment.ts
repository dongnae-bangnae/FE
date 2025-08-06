import { CreateCommentRequest, CreateCommentApiResponse } from "../types/comment";
import { axiosInstance } from "./axiosInstance";

export const createComment = async (articleId: number, data: CreateCommentRequest): Promise<CreateCommentApiResponse> => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/comments`, data);
  return response.data;
};

//댓글 수정
export const updateComment = (articleId: number, commentId: number, content: string) => {
  return axiosInstance.put(`/api/articles/${articleId}/comments/${commentId}`, { content });
};

//댓글 삭제
export const deleteComment = (articleId: number, commentId: number) => {
  return axiosInstance.delete(`/api/articles/${articleId}/comments/${commentId}`);
};
