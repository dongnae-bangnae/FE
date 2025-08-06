import { useMutation } from "@tanstack/react-query";
import { reportSpam, unreportSpam } from "../../apis/article";

export const useToggleSpamReport = (articleId: number) => {
  return useMutation({
    mutationFn: async (reported: boolean) => {
      return reported
        ? await reportSpam(articleId)
        : await unreportSpam(articleId);
    },
  });
};
