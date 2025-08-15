import { useMutation } from "@tanstack/react-query";
import { ArticleForm } from "../../types/article";
import { createArticle } from "../../apis/article";

export const useCreateArticle = () => {
  return useMutation<number, Error, ArticleForm>({
    mutationFn: (form) => createArticle(form),
  });
};
