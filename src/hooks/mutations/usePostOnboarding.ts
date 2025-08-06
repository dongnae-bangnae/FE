import { useMutation } from "@tanstack/react-query";
import { postOnboarding } from "../../apis/onboarding";

export const usePostOnboarding = () => {
  return useMutation({
    mutationFn: postOnboarding
  });
};
