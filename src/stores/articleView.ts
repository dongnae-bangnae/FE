//좋아요, 신고, 댓글 수 관리
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ArticleViewState = {
  articleId: number;
  // 메타
  title: string;
  content: string;
  date: string;
  mainImageUuid: string | null;
  imageUuids: string[];

  // 위치(지도)
  latitude: number | null;
  longitude: number | null;

  // 카운트/플래그
  likeCount: number;
  spamCount: number;
  commentCount: number;
  liked: boolean;
  isReported: boolean;

  // actions
  hydrate: (p: Partial<ArticleViewState>) => void;
  setCommentCount: (n: number) => void;

  setLiked: (b: boolean) => void;
  incLike: () => void;
  decLike: () => void;

  setReported: (b: boolean) => void;
  incSpam: () => void;
  decSpam: () => void;

  reset: () => void;
};

export const useArticleViewStore = create<ArticleViewState>()(
  devtools(
    (set) => ({
      articleId: null,

      title: "",
      content: "",
      date: "",
      mainImageUuid: null,
      imageUuids: [],

      latitude: null,
      longitude: null,

      likeCount: 0,
      spamCount: 0,
      commentCount: 0,
      liked: false,
      isReported: false,

      hydrate: (p) => set((s) => ({ ...s, ...p })),

      setCommentCount: (n) => set({ commentCount: n }),

      setLiked: (b) => set({ liked: b }),
      incLike: () => set((s) => ({ likeCount: s.likeCount + 1 })),
      decLike: () => set((s) => ({ likeCount: Math.max(0, s.likeCount - 1) })),

      setReported: (b) => set({ isReported: b }),
      incSpam: () => set((s) => ({ spamCount: s.spamCount + 1 })),
      decSpam: () => set((s) => ({ spamCount: Math.max(0, s.spamCount - 1) })),

      reset: () =>
        set({
          articleId: -1,
          title: "",
          content: "",
          date: "",
          mainImageUuid: null,
          imageUuids: [],
          latitude: null,
          longitude: null,
          likeCount: 0,
          spamCount: 0,
          commentCount: 0,
          liked: false,
          isReported: false,
        }),
    })
  )
);
