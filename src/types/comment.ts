import { ApiResponse } from "./common";

export interface CreateCommentRequest {
  content: string;
  parentCommentId: number | null;
}

export interface CreateCommentResponse {
  commentId: number;
  articleId: number;
  content: string;
  parentCommentId: number | null;
  createdAt: string;
  updatedAt: string;
}
export type CreateCommentApiResponse = ApiResponse<CreateCommentResponse>;

/** 화면/API 공용 댓글 데이터 */
export type CommentModel = {
  id: number;
  content: string;
  nickname: string;
  profileImage: string;
  parentCommentId: number | null;
  createdAt?: string;
};
