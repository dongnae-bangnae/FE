import { useMutation } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";

export const useDeleteComment = (articleId: number, commentId: number) =>
  useMutation({
    mutationFn: () => deleteComment(articleId, commentId),
  });
