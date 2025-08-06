import { useQuery } from "@tanstack/react-query";
import { getNewArticles } from "../../apis/home";

export const useNewArticles = () => {
  return useQuery({
    queryKey: ["newArticles"],
    queryFn: () => getNewArticles(1), // 필요하면 page 넘겨받도록 바꿔도 됨
    staleTime: 1000 * 60 * 10 // 10분 캐시 유지 (선택)
  });
};
