import { useMutation } from "@tanstack/react-query";
import { updateComment } from "../../apis/comment";

export const useUpdateComment = (articleId: number, commentId: number) =>
  useMutation({
    mutationFn: (content: string) => updateComment(articleId, commentId, content),
  });
