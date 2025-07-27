import { useMutation } from "@tanstack/react-query";

import { patchRegions } from "../../apis/member";

export const usePatchRegions = () => {
  return useMutation({
    mutationFn: patchRegions,
    onSuccess: (data) => {
      console.log("관심 동네 변경 성공:", data);
    },
    onError: (error: any) => {
      console.error("관심 동네 변경 실패:", error.response?.data);
    }
  });
};
