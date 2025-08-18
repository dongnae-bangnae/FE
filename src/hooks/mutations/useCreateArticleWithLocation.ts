import { useMutation } from "@tanstack/react-query";
import { createArticle } from "../../apis/article";
import { ArticleForm, CreatedArticleResult } from "../../types/article";

type Payload = ArticleForm & { files?: File[]; mainIndex?: number };

export const useCreateArticleWithLocation = () => {
  return useMutation<CreatedArticleResult, Error, Payload>({
    mutationFn: ({ files, mainIndex, ...rest }) =>
      createArticle(rest, { files, mainIndex }),
  });
};
