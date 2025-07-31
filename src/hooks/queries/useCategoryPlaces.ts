import { useQuery } from "@tanstack/react-query";

import { getPlacesByCategory } from "../../apis/place";

export const useCategoryPlaces = (
  categoryId: number,
  cursor?: number,
  limit = 10
) => {
  return useQuery({
    queryKey: ["categoryPlaces", categoryId, cursor],
    queryFn: () => getPlacesByCategory(categoryId, cursor, limit),
    enabled: !!categoryId // categoryId가 있을 때만 요청
  });
};
