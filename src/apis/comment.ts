import { CreateCommentRequest, CreateCommentApiResponse } from "../types/comment";
import { GetCommentsResponse } from "../types/comment";
import { axiosInstance } from "./axiosInstance";

export const createComment = async (articleId: number, data: CreateCommentRequest): Promise<CreateCommentApiResponse> => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/comments`, data, {
    headers: {
            "Content-Type": "application/json",
        },
  });
  
  return response.data;
};

export const getComments = async (articleId: number): Promise<GetCommentsResponse> => {
  const response = await axiosInstance.get(`/api/articles/${articleId}/comments`);
  return response.data;
};
