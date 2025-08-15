import { ApiResponse } from "./common";

export interface CreateCommentRequest {
  content: string;
  parentCommentId: number | null;
}

export interface CreateCommentResponse {
  commentId: number;
  articleId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentCommentId: number | null;
}

export type CreateCommentApiResponse = ApiResponse<CreateCommentResponse>;