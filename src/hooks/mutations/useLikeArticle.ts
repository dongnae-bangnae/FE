import { useMutation } from "@tanstack/react-query";
import { likeArticle } from "../../apis/article";
import { LikeResponse } from "../../types/article";

export const useLikeArticle = (articleId: number) => {
  return useMutation<LikeResponse, Error>({
    mutationFn: () => likeArticle(articleId),
  });
};