import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchNickname } from "../../apis/member";

export const usePatchNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchNickname,
    onSuccess: (data) => {
      if (data?.isSuccess) {
        alert("닉네임이 성공적으로 변경되었습니다!");
        queryClient.invalidateQueries({ queryKey: ["myInfo"] }); // 변경 필요 (회원 정보 refetch 등_
      } else {
        alert(data?.message || "닉네임 변경에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "에러가 발생했습니다.";
      alert(message);
    }
  });
};
