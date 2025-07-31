import { useQuery } from "@tanstack/react-query";

import { fetchCategory } from "../../apis/category";

export const useMyCategories = () => {
  return useQuery({
    queryKey: ["myCategories"],
    queryFn: fetchCategory
  });
};
