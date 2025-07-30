import { useQuery } from "@tanstack/react-query";
import { fetchDefaultImages } from "../../apis/defaultImages";

export const useDefaultImages = () => {
  return useQuery({
    queryKey: ["defaultImages"],
    queryFn: fetchDefaultImages,
    staleTime: 1000 * 60 * 10, // 10분간 fresh
    refetchOnWindowFocus: false,
  });
};