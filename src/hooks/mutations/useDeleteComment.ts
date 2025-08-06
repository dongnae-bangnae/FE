import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";

interface DeleteCommentParams {
  articleId: number;
  commentId: number;
}

export const useDeleteComment = () =>
  useMutation({
    mutationFn: ({ articleId, commentId }: DeleteCommentParams) =>
      deleteComment(articleId, commentId),
  });