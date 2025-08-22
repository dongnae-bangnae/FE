import { useQuery } from "@tanstack/react-query";
import { fetchParentComments, fetchReplies } from "../../apis/comment";

export interface FlatComment {
  id: number;
  content: string;
  nickname: string;
  profileImage: string;
  parentCommentId: number | null; 
}

function pickList(res: any): any[] {
  if (Array.isArray(res?.result?.comments)) return res.result.comments; // {result:{comments:[]}}
  if (Array.isArray(res?.result)) return res.result;                    // {result:[]}
  if (Array.isArray(res?.comments)) return res.comments;                // {comments:[]}
  if (Array.isArray(res)) return res;                                   // []
  if (Array.isArray(res?.data?.result?.comments)) return res.data.result.comments;
  if (Array.isArray(res?.data?.result)) return res.data.result;
  if (Array.isArray(res?.data?.comments)) return res.data.comments;
  return [];
}

const normalizeParent = (c: any): FlatComment => ({
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

export function useFetchComments(articleId: number, opts?: { enabled?: boolean }) {
  return useQuery<FlatComment[]>({
    queryKey: ["comments", articleId],
    enabled: opts?.enabled ?? true,
    queryFn: async () => {
      // 부모 댓글
      const parentRes = await fetchParentComments(articleId);
      const parentsRaw = pickList(parentRes);
      const parents = parentsRaw.map(normalizeParent);

      // 답글
      const repliesArrays = await Promise.all(
        parents.map(async (p) => {
          try {
            const repRes = await fetchReplies(articleId, p.id);
            const repsRaw = pickList(repRes);
            return repsRaw.map((r: any) => normalizeReply(r, p.id));
          } catch {
            return [] as FlatComment[];
          }
        })
      );

      return [...parents, ...repliesArrays.flat()];
    },
  });
}