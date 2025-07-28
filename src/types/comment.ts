import { ApiResponse } from "./common";

export interface CreateCommentRequest {
  content: string;
  parentCommentId: number;
}

export interface CreateCommentResponse {
  commentId: number;
  articleId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  parentCommentId: number;
}

export type CreateCommentApiResponse = ApiResponse<CreateCommentResponse>;
