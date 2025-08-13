import { useMutation } from "@tanstack/react-query";
import { OnboardingPayload, postOnboarding } from "../../apis/onboarding";

export const usePostOnboarding = () =>
  useMutation({
    mutationFn: (payload: OnboardingPayload) => postOnboarding(payload),
  });