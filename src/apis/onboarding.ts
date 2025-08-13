import { axiosInstance } from "./axiosInstance";

export interface OnboardingPayload {
	nickname: string;
	chosenRegionIds: number[]; // 최소 1, 최대 3
}

/**
 * 온보딩은 반드시 JSON으로 전송 (FormData 금지)
 */
export async function postOnboarding(payload: OnboardingPayload) {
	// 개발 중 실수 방지: 런타임에서 FormData를 강하게 차단
	if (typeof FormData !== "undefined" && (payload as any) instanceof FormData) {
		throw new Error("postOnboarding에는 FormData를 넘기면 안 됩니다. JSON으로 보내세요.");
	}

	// 최신 CSRF 확보 후 즉시 POST 
	await axiosInstance.get("/csrf");

	return axiosInstance.post("/api/member/onboarding", payload, {
		headers: { "Content-Type": "application/json" },
	});
}
