import { useMutation } from "@tanstack/react-query";
import { createArticle } from "../../apis/article";
import { ArticleForm } from "../../types/article";

type Payload = ArticleForm & { files?: File[]; mainIndex?: number }; // [ADD]

export const useCreateArticleWithLocation = () => {
  return useMutation<number, Error, Payload>({
    mutationFn: ({ files, mainIndex, ...rest }) =>
      createArticle(rest, { files, mainIndex }), // [MOD]
  });
};