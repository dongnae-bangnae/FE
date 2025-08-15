// src/hooks/queries/useArticles.ts
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchArticlesByPlace, type PlaceArticleRow } from "../../apis/article";

export type PlaceArticlesPage = {
  items: PlaceArticleRow[];
  nextCursor: number | null;
  hasNext: boolean;
  limit: number;
};

export function usePlaceArticles(placeId: number, limit = 10) {
  return useInfiniteQuery<
    PlaceArticlesPage, // TQueryFnData
    Error, // TError
    InfiniteData<PlaceArticlesPage>, // TData = InfiniteData<...>
    readonly ["placeArticles", number, number], // TQueryKey
    number // TPageParam
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
