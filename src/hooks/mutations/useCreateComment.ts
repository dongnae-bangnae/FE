import { useMutation } from "@tanstack/react-query";
import { createComment } from "../../apis/comment";
import { CreateCommentRequest, CreateCommentApiResponse } from "../../types/comment";

export const useCreateComment = (articleId: number) => {
  return useMutation<CreateCommentApiResponse, Error, CreateCommentRequest>({
    mutationFn: (data) => createComment(articleId, data),
  });
};
