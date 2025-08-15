import { CreateCommentRequest, CreateCommentApiResponse, CommentModel } from "../types/comment";
import { ApiResponse } from "../types/common";
import { axiosInstance } from "./axiosInstance";

// helpers
const unwrap = <T,>(data: any): T => (data?.result ?? data);
const toModel = (c: any): CommentModel => ({
  id: c.commentId ?? c.id,
  content: c.content ?? "",
  nickname: c.nickname ?? c.member?.nickname ?? "익명",
  profileImage: c.profileImage ?? c.member?.profileImage ?? "",
  parentCommentId: c.parentCommentId ?? (typeof c.parentId === "number" ? c.parentId : null),
  createdAt: c.createdAt,
});

//댓글 생성 
export async function createComment(
  articleId: number,
  payload: CreateCommentRequest
): Promise<CreateCommentApiResponse> {
  const res = await axiosInstance.post<CreateCommentApiResponse>(
    `/api/articles/${articleId}/comments`,
    payload
  );
  return res.data; 
}

//댓글 수정
export const updateComment = (articleId: number, commentId: number, content: string) => {
  return axiosInstance.put(`/api/articles/${articleId}/comments/${commentId}`, { content });
};

//댓글 삭제
export const deleteComment = (articleId: number, commentId: number) => {
  return axiosInstance.delete(`/api/articles/${articleId}/comments/${commentId}`);
};

export async function getComments(articleId: number): Promise<CommentModel[]> {
  const res = await axiosInstance.get(`/api/articles/${articleId}/comments`);
  const list = unwrap<any[]>(res.data);
  return (Array.isArray(list) ? list : []).map(toModel);
}

// 답글 조회
export async function getReplies(articleId: number, parentCommentId: number): Promise<CommentModel[]> {
  const res = await axiosInstance.get(
    `/api/articles/${articleId}/comments/${parentCommentId}/replies`
  );
  const list = unwrap<any[]>(res.data);
  return (Array.isArray(list) ? list : []).map(toModel);
}