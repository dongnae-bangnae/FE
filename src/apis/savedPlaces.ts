import { axiosInstance } from "./axiosInstance";

export type SavedPlaceRow = {
  placeId: number;
  title: string;
  pinCategory: string;
  latitude: number;
  longitude: number;
};

export type SavedPlacesPage = {
  places: SavedPlaceRow[];
  nextCursor: number | null; // 다음 요청에 넘길 save_place PK
  hasNext: boolean;
  limit: number;
};

export async function fetchSavedPlacesByCategory(
  categoryId: number,
  cursor?: number | null, // 첫 페이지면 생략(null/undefined)
  limit = 20
): Promise<SavedPlacesPage> {
  const params: Record<string, any> = { limit };
  if (cursor !== null && cursor !== undefined) params.cursor = cursor;

  const { data } = await axiosInstance.get(
    `/api/categories/${categoryId}/places`,
    { params }
  );

  // 스웨거 예시: result: { places: [...], cursor, limit, hasNext }
  const result = data?.result ?? {};
  const places: SavedPlaceRow[] = Array.isArray(result.places)
    ? result.places
    : [];

  // 서버가 cursor/hasNext를 내려주면 신뢰, 없으면 보수적으로 추론
  const nextCursor: number | null =
    typeof result.cursor === "number"
      ? result.cursor
      : places.length
        ? places[places.length - 1].placeId
        : null;

  const hasNext: boolean =
    typeof result.hasNext === "boolean"
      ? result.hasNext
      : places.length === limit;

  return { places, nextCursor, hasNext, limit };
}
