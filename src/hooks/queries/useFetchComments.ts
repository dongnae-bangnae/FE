import { useQuery } from "@tanstack/react-query";
import { fetchComment } from "../../apis/comment";

export const useFetchComments = (articleId: number) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchComment(articleId),
    staleTime: 30 * 1000,
  });
};