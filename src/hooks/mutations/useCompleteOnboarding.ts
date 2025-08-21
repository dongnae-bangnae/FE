import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitOnboarding } from "../../apis/member";

type Payload = {
  nickname: string;
  regionIds: number[]; // 선택된 지역 id 배열
  imageFile?: File | null; // 선택
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nickname, regionIds, imageFile }: Payload) => {
      return submitOnboarding({
        nickname: nickname.trim(),
        chosenRegionIds: regionIds,
        profileImage: imageFile ?? null
      });
    },
    onSuccess: () => {
      // 온보딩 후 내 정보 갱신
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    }
  });
};
