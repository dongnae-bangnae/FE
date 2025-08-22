import { axiosInstance } from "./axiosInstance";

// 카테고리별 장소 조회
export const getPlacesByCategory = async (
  categoryId: number,
  cursor?: number | null,
  limit: number = 20
) => {
  const params: Record<string, any> = { limit };
  // 첫 페이지면 cursor 전달하지 않음(null/undefined)
  if (cursor !== undefined && cursor !== null && cursor !== 0) {
    params.cursor = cursor;
  }

  const { data } = await axiosInstance.get(
    `/api/categories/${categoryId}/places`,
    { params }
  );
  return data.result; // { places, cursor, limit, hasNext }
};

// 지도 범위 내 장소 조회
export interface FetchPlacesParams {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

export const fetchPlacesWithinBounds = async ({
  latMin,
  latMax,
  lngMin,
  lngMax
}: FetchPlacesParams) => {
  const { data } = await axiosInstance.get("/api/places/map", {
    params: {
      latMin,
      latMax,
      lngMin,
      lngMax
    }
  });
  return data.result.places;
};

// 주소 키워드 검색 (ex. 연남동 → 서울시 마포구 연남동 + 지역 ID 반환)
export const searchPlacesByKeyword = async (keyword: string) => {
  const { data } = await axiosInstance.get("/api/places/search", {
    params: { keyword }
  });

  return data.result; // 백엔드 응답 구조에 따라 result 안에 fullAddress, id가 들어 있음
};

// 장소 카테고리 내 저장
export const savePlaceToCategory = async (
  placeId: number,
  categoryId: number
) => {
  const { data } = await axiosInstance.post(
    `/api/places/${placeId}/categories`,
    { categoryId },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return data.result;
};
