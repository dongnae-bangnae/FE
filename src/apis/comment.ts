import { CreateCommentRequest, CreateCommentApiResponse } from "../types/comment";
import { axiosInstance } from "./axiosInstance";

export const createComment = async (articleId: number, data: CreateCommentRequest): Promise<CreateCommentApiResponse> => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/comments`, data, {
    headers: {
            "Content-Type": "application/json",
        },
  });
  
  return response.data;
};
