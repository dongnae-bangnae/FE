import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";
import { ApiResponse } from "../../types/common";

/* ---- 타입 ---- */
export interface SavedPlace {
  placeId: number;
  title: string;
  pinCategory: string;
  latitude: number;
  longitude: number;
}

export interface SavedPlacesResponse {
  places: SavedPlace[];
  cursor?: number; // 서버가 줄 수도, 안 줄 수도
  limit?: number;
  hasNext?: boolean;
}

export type SavedPlacesPage = {
  places: SavedPlace[];
  nextCursor: number | null; // 다음 요청에 넘길 cursor
  hasNext: boolean;
  limit: number;
};

/* ---- 훅 ---- */
export function useSavedPlaces(categoryId: number, limit = 20) {
  return useInfiniteQuery<
    SavedPlacesPage,
    Error,
    InfiniteData<SavedPlacesPage>,
    readonly ["savedPlaces", number, number],
    number | null // pageParam 타입 (cursor)
  >({
    queryKey: ["savedPlaces", categoryId, limit] as const,
    initialPageParam: null, // 첫 페이지는 cursor 없음(생략)
    enabled: Number.isFinite(categoryId),
    queryFn: async ({ pageParam = null }) => {
      const params: Record<string, any> = { limit };
      if (pageParam !== null && pageParam !== undefined)
        params.cursor = pageParam;

      const { data } = await axiosInstance.get<
        ApiResponse<SavedPlacesResponse>
      >(`/api/categories/${categoryId}/places`, { params });
      const result = data?.result ?? {};
      const places: SavedPlace[] = Array.isArray(result.places)
        ? result.places
        : [];

      // 서버가 cursor/hasNext를 주면 사용, 없으면 보수적으로 추론
      const nextCursor =
        typeof result.cursor === "number"
          ? result.cursor
          : places.length
            ? places[places.length - 1].placeId
            : null;

      const hasNext =
        typeof result.hasNext === "boolean"
          ? result.hasNext
          : places.length === limit;

      return { places, nextCursor, hasNext, limit };
    },
    getNextPageParam: (last) =>
      last.hasNext ? (last.nextCursor ?? undefined) : undefined
  });
}
