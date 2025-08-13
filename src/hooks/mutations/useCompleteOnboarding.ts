import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  patchNickname,
  patchRegions,
  patchProfileImage,
  postOnboarding
} from "../../apis/member";

type Payload = {
  nickname: string;
  regionIds: number[]; // normalizeToId 로 만든 숫자 배열
  imageFile?: File | null;
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nickname, regionIds, imageFile }: Payload) => {
      // 1) 닉네임
      await patchNickname(nickname.trim());

      // 2) 관심 동네
      await patchRegions(regionIds);

      // 3) 프로필 이미지(선택)
      if (imageFile) {
        await patchProfileImage(imageFile);
      }

      // 4) 온보딩 완료 플래그
      const result = await postOnboarding();
      return result;
    },
    onSuccess: () => {
      // 온보딩 후 내 정보 갱신
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    }
  });
};
