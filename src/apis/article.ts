import { ApiResponse } from "../types/common";
import { axiosInstance } from "./axiosInstance";

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
  cursor: number = 0,
  limit: number = 10
): Promise<ArticleListResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<ArticleListResponse>>(
    `/api/categories/${categoryId}/articles`,
    {
      params: { cursor, limit }
    }
  );
  return data.result;
};
