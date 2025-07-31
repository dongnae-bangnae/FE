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

export const useSavedPlaces = (categoryId: number, cursor = 0, limit = 10) => {
  return useQuery({
    queryKey: ["savedPlaces", categoryId, cursor],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        ApiResponse<{
          places: SavedPlace[];
          cursor: number;
          limit: number;
          hasNext: boolean;
        }>
      >(`/api/categories/${categoryId}/places`, {
        params: { cursor, limit }
      });
      return data.result.places;
    },
    enabled: !!categoryId
  });
};
