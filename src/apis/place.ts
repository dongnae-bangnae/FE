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

export const fetchPlacesWithinBounds = async ({latMin, latMax, lngMin, lngMax}: FetchPlacesParams) => {
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

// 장소 카테고리 내 저장 
export const savePlaceToCategory = async (placeId: number, categoryId: number) => {
  const { data } = await axiosInstance.post(`/api/places/${placeId}/categories`, { categoryId }, {
    headers: {
      "Content-Type": "application/json", 
    },
  })

  return data.result;
}