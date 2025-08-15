import {
  useQuery,
  useInfiniteQuery,
  type InfiniteData
} from "@tanstack/react-query";
import {
  fetchArticles,
  fetchArticlesByPlace,
  type PlaceArticleRow
} from "../../apis/article";

/** 🔹 기존 페이지들이 쓰는 기본 목록 훅 (cursor/limit) */
export function useArticles(cursor = 0, limit = 10) {
  return useQuery({
    queryKey: ["articles", cursor, limit] as const,
    queryFn: () => fetchArticles(cursor, limit)
  });
}

/** 🔹 장소(placeId) 기반 무한 스크롤 훅 */
export type PlaceArticlesPage = {
  items: PlaceArticleRow[];
  nextCursor: number | null;
  hasNext: boolean;
  limit: number;
};

export function usePlaceArticles(placeId: number, limit = 10) {
  return useInfiniteQuery<
    PlaceArticlesPage,
    Error,
    InfiniteData<PlaceArticlesPage>,
    readonly ["placeArticles", number, number],
    number
  >({
    queryKey: ["placeArticles", placeId, limit] as const,
    initialPageParam: -1,
    queryFn: ({ pageParam }) =>
      fetchArticlesByPlace(placeId, pageParam as number, limit),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: !!placeId
  });
}
