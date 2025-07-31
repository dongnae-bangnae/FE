import { axiosInstance } from "./axiosInstance";

// 카테고리별 장소 조회
export const getPlacesByCategory = async (
  categoryId: number,
  cursor?: number,
  limit: number = 10
) => {
  const params = {
    cursor,
    limit
  };

  const { data } = await axiosInstance.get(
    `/api/categories/${categoryId}/places`,
    {
      params
    }
  );

  return data.result;
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
  console.log("[fetchPlacesWithinBounds] 호출 직전 파라미터 확인", {
    latMin,
    latMax,
    lngMin,
    lngMax
  });

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
