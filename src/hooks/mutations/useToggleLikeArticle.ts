import { useMutation } from "@tanstack/react-query";
import { likeArticle, unlikeArticle } from "../../apis/article";

interface ToggleLikeParams {
  liked: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}

export const useToggleLikeArticle = (articleId: number) => {
  return useMutation({
    mutationFn: async (liked: boolean) => {
      return liked ? await unlikeArticle(articleId) : await likeArticle(articleId);
    },
  });
};
