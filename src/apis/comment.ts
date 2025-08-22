import { CreateCommentRequest, CreateCommentApiResponse } from "../types/comment";
import { axiosInstance } from "./axiosInstance";

export const createComment = async (articleId: number, data: CreateCommentRequest): Promise<CreateCommentApiResponse> => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/comments`, data);
  return response.data;
};

//댓글 수정
export const updateComment = (articleId: number, commentId: number, content: string) => {
  return axiosInstance.patch(`/api/articles/${articleId}/comments/${commentId}`, { content });
};

//댓글 삭제
export const deleteComment = (articleId: number, commentId: number) => {
  return axiosInstance.delete(`/api/articles/${articleId}/comments/${commentId}`);
};

//부모 댓글 조회
export const fetchParentComments = async (articleId: number) => {
  const res = await axiosInstance.get(`/api/articles/${articleId}/comments`);
  return res.data;
}

//답글 조회
export const fetchReplies = async (articleId: number, parentCommentId: number) => {
  const res = await axiosInstance.get(`/api/articles/${articleId}/comments/${parentCommentId}/replies`);
  return res.data; 
};