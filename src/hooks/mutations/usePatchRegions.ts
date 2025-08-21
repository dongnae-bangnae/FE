import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRegions } from "../../apis/member";

export const usePatchRegions = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (regionIds: number[]) => patchRegions(regionIds),
    onSuccess: (data, variables) => {
      //  홈/마이페이지에서 최신 관심동네 반영
      qc.invalidateQueries({ queryKey: ["myInfo"] });

      console.log("관심 동네 변경 성공:", data);
      console.log("변경된 regionIds:", variables);
    },
    onError: (error: any) => {
      console.error("관심 동네 변경 실패:", error?.response?.data ?? error);
    }
  });
};
