import { axiosInstance } from "./axiosInstance";

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
