import { useMutation } from "@tanstack/react-query";
import { deleteArticle } from "../../apis/article";

export const useDeleteArticle = () => {
  return useMutation({
    mutationFn: (articleId: number) => deleteArticle(articleId),
  });
};