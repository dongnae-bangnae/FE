import { useQuery } from "@tanstack/react-query";
import { getNewArticles, type HomeArticlesResult } from "../../apis/home";

export const useNewArticles = (page = 1) =>
  useQuery<HomeArticlesResult>({
    queryKey: ["homeNewArticles", page],
    queryFn: () => getNewArticles(page),
    staleTime: 1000 * 60 * 10
  });
