import { useMutation } from "@tanstack/react-query";
import { reportSpam } from "../../apis/article";
import { ApiResponse } from "../../types/common";

export const useReportSpam = (articleId: number) => {
  return useMutation<ApiResponse<null>, Error>({
    mutationFn: () => reportSpam(articleId),
  });
};
