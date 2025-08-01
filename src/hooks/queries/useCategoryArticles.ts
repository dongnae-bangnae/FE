import { useQuery } from "@tanstack/react-query";

import { fetchCategoryArticles } from "../../apis/article";
import { ArticleListResponse } from "../../apis/article";

export const useCategoryArticles = (
  categoryId: number,
  cursor = 0,
  limit = 10
) => {
  return useQuery<ArticleListResponse, Error>({
    queryKey: ["categoryArticles", categoryId, cursor],
    queryFn: () => fetchCategoryArticles(categoryId, cursor, limit),
    enabled: !!categoryId
  });
};
