import { useMutation } from "@tanstack/react-query";
import { reportSpam } from "../../apis/article"; // 실제 API 요청 함수

export const useReportSpam = () => {
  return useMutation({
    mutationFn: (articleId: number) => reportSpam(articleId),
  });
};
