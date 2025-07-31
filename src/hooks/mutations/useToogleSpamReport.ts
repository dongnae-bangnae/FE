import { useMutation } from "@tanstack/react-query";
import { reportSpam, unreportSpam } from "../../apis/article";

export const useToggleSpamReport = (
  articleId: number,
  isReported: boolean,
  onSuccessCallback: (isNowReported: boolean) => void
) => {
  return useMutation({
    mutationFn: async () => {
      return isReported ? unreportSpam(articleId) : reportSpam(articleId);
    },
    onSuccess: () => {
      onSuccessCallback(!isReported);
    },
    onError: () => {
      alert("광고 신고 처리 중 오류가 발생했습니다.");
    },
  });
};