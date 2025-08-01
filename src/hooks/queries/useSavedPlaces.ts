import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from "../../apis/axiosInstance";
import { ApiResponse } from "../../types/common";

export interface SavedPlace {
  placeId: number;
  title: string;
  pinCategory: string;
  latitude: number;
  longitude: number;
}

interface SavedPlacesResponse {
  places: SavedPlace[];
  cursor: number;
  limit: number;
  hasNext: boolean;
}

export const useSavedPlaces = (categoryId: number, cursor = 0, limit = 10) => {
  return useQuery({
    queryKey: ["savedPlaces", categoryId, cursor],
    queryFn: async () => {
      const params: Record<string, any> = { limit };

      if (cursor !== undefined && cursor !== null && cursor !== 0) {
        params.cursor = cursor;
      }

      const { data } = await axiosInstance.get<
        ApiResponse<SavedPlacesResponse>
      >(`/api/categories/${categoryId}/places`, { params });

      return data.result.places;
    },
    enabled: !!categoryId
  });
};
