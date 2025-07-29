import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comment";
import { GetCommentsResponse } from "../../types/comment";

export const useComments = (articleId: number) => {
  return useQuery<GetCommentsResponse>({
    queryKey: ["comments", articleId],
    queryFn: () => getComments(articleId),
  });
};
