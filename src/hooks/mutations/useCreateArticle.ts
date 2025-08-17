import { useMutation } from "@tanstack/react-query";
import { createArticleAtPlace, ArticleFormAtPlace } from "../../apis/article";

type Payload = ArticleFormAtPlace & { files?: File[]; mainIndex?: number }; // [ADD]

export const useCreateArticle = () => {
  return useMutation<number, Error, Payload>({
    mutationFn: ({ files, mainIndex, ...rest }) =>
      createArticleAtPlace(rest, { files, mainIndex }), // [MOD]
  });
};