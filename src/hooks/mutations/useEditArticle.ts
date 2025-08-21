import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editArticle } from "../../apis/article";
import { ArticleForm } from "../../types/article";

export const useEditArticle = (articleId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (form: Partial<ArticleForm>) => editArticle(articleId, form),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["articleDetail", articleId] });
      await qc.invalidateQueries({ queryKey: ["articles"] });
    }
  });
};