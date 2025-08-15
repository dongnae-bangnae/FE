import { useQuery } from "@tanstack/react-query";
import { fetchComments, fetchReplies } from "../../apis/comment";

//부모 댓글 조회
export const useFetchComments = (articleId: number) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchComments(articleId),
    staleTime: 30 * 1000,
  });
};

// 답글 조회
export const useFetchReplies = (articleId: number, parentCommentId: number) => {
  return useQuery({
    queryKey: ["replies", articleId, parentCommentId],
    queryFn: () => fetchReplies(articleId, parentCommentId),
    staleTime: 30 * 1000,
    enabled: !!parentCommentId, // parentCommentId 있을 때만
  });
};