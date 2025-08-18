import { useMutation } from "@tanstack/react-query";
import { createArticleAtPlace } from "../../apis/article";
import { ArticleForm, CreatedArticleResult } from "../../types/article";

type Payload = Omit<ArticleForm, "latitude" | "longitude"> & {
  placeId: number;
  files?: File[];
  mainIndex?: number;
};

export const useCreateArticle = () => {
  return useMutation<CreatedArticleResult, Error, Payload>({
    mutationFn: ({ files, mainIndex, ...rest }) =>
      createArticleAtPlace(rest, { files, mainIndex }),
  });
};