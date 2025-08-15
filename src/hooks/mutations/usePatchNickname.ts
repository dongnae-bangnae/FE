import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchNickname } from "../../apis/member";

type Options = { silent?: boolean };

export const usePatchNickname = (opts?: Options) => {
  const { silent = false } = opts ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchNickname,
    onSuccess: (data) => {
      // 공통: 내 정보는 항상 새로고침
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });

      if (!silent) {
        if (data?.isSuccess) {
          alert("닉네임이 성공적으로 변경되었습니다!");
        } else {
          alert(data?.message || "닉네임 변경에 실패했습니다.");
        }
      }
    },
    onError: (error: any) => {
      if (!silent) {
        const message =
          error?.response?.data?.message || "에러가 발생했습니다.";
        alert(message);
      }
      // silent=true면 알림 없이 에러를 그대로 throw → 사용처에서 catch
    }
  });
};
