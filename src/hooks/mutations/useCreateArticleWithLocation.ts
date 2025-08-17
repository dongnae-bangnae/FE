import { useMutation } from "@tanstack/react-query";
import { createArticle } from "../../apis/article"; // <-- /with-location 호출
import { ArticleForm } from "../../types/article";

export const useCreateArticleWithLocation = () => {
  return useMutation<number, Error, ArticleForm>({
    mutationFn: (payload) => createArticle(payload),
  });
};
