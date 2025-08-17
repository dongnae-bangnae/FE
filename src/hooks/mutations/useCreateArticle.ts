import { useMutation } from "@tanstack/react-query";
import { createArticleAtPlace, ArticleFormAtPlace } from "../../apis/article";

export const useCreateArticle = () => {
  return useMutation<number, Error, ArticleFormAtPlace>({
    mutationFn: (payload) => createArticleAtPlace(payload),
  });
};
