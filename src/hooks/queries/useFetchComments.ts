import { useQuery } from "@tanstack/react-query";
import { fetchParentComments, fetchReplies } from "../../apis/comment";

export interface FlatComment {
  id: number;
  content: string;
  nickname: string;
  profileImage: string;
  parentCommentId: number | null;
}

const normalizeOne = (c: any): FlatComment => ({
  id: c?.commentId ?? c?.id,
  content: c?.content ?? "",
  nickname: c?.nickname ?? c?.writerNickname ?? "",
  profileImage: c?.profileImage ?? c?.writerProfileImage ?? "",
  parentCommentId: null,
});

const normalizeReply = (c: any, parentId: number): FlatComment => ({
  id: c?.commentId ?? c?.id,
  content: c?.content ?? "",
  nickname: c?.nickname ?? c?.writerNickname ?? "",
  profileImage: c?.profileImage ?? c?.writerProfileImage ?? "",
  parentCommentId: parentId,
});

export function useFetchComments(articleId: number, opts?: { enabled?: boolean}) {
  return useQuery<FlatComment[]>({
    queryKey: ["comments", articleId],
    enabled: opts?.enabled ?? true,
    queryFn: async () => {
      // 부모댓글
      const parentRes = await fetchParentComments(articleId);
      const parentsRaw = Array.isArray(parentRes?.result) ? parentRes.result : parentRes;
      const parents = (Array.isArray(parentsRaw) ? parentsRaw : []).map(normalizeOne);

      // 답글
      const repliesArrays = await Promise.all(
        parents.map(async (p) => {
          try {
            const repRes = await fetchReplies(articleId, p.id);
            const raw = Array.isArray(repRes?.result) ? repRes.result : repRes;
            const list = Array.isArray(raw) ? raw : [];
            return list.map((r: any) => normalizeReply(r, p.id));
          } catch {
            return [] as FlatComment[];
          }
        })
      );

      return [...parents, ...repliesArrays.flat()];
    },
  });
}
