import { useQuery } from "@tanstack/react-query";

import { fetchArticles } from "../../apis/article";

export const useArticles = (cursor = 0, limit = 10) => {
  return useQuery({
    queryKey: ["articles", cursor, limit],
    queryFn: () => fetchArticles(cursor, limit)
  });
};
