import { axiosInstance } from "./axiosInstance";

export interface OnboardingPayload { nickname: string; chosenRegionIds: number[]; }

export async function postOnboarding(payload: OnboardingPayload) {
  await axiosInstance.get("/csrf");
  return axiosInstance.post("/api/member/onboarding", payload, {
    headers: { "Content-Type": "application/json" },
  });
}
