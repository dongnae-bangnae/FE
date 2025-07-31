import { useQuery } from "@tanstack/react-query";
import { fetchArticleDetail } from "../../apis/article";

export const useArticleDetail = (articleId: number) => {
  return useQuery({
    queryKey: ["articleDetail", articleId],
    queryFn: () => fetchArticleDetail(articleId),
    enabled: !!articleId,
  });
};
