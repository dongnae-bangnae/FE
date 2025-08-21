import {
  type InfiniteData,
  useInfiniteQuery,
  useQuery
} from "@tanstack/react-query";

import {
  fetchArticles,
  fetchArticlesByPlace,
  fetchArticlesByPlaceV2,
  type PlaceArticleRow,
  type PlaceCursor
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

// V1 단일 커서
export function usePlaceArticles(placeId: number, limit = 10) {
  return useInfiniteQuery<
    PlaceArticlesPage,
    Error,
    InfiniteData<PlaceArticlesPage>,
    readonly ["placeArticles", number, number],
    number | null
  >({
    queryKey: ["placeArticles", placeId, limit] as const,
    initialPageParam: null, // 또는 undefined
    queryFn: ({ pageParam }) =>
      fetchArticlesByPlace(placeId, pageParam as number | null, limit),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled: !!placeId
  });
}

// V2 복합 커서 - RecordListPage 전용
export type PlaceArticlesPageV2 = {
  items: PlaceArticleRow[];
  nextCursor: PlaceCursor | null;
  hasNext: boolean;
  limit: number;
};

export function usePlaceArticlesV2(placeId: number, limit = 10) {
  return useInfiniteQuery<
    PlaceArticlesPageV2,
    Error,
    InfiniteData<PlaceArticlesPageV2>,
    readonly ["placeArticlesV2", number, number],
    PlaceCursor | null
  >({
    queryKey: ["placeArticlesV2", placeId, limit] as const,
    initialPageParam: null, // 첫 호출은 커서 없음
    queryFn: ({ pageParam }) =>
      fetchArticlesByPlaceV2(placeId, pageParam, limit),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled: !!placeId
  });
}
