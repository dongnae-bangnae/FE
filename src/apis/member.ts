import { axiosInstance } from "./axiosInstance";

// 닉네임 (최초등록/수정 겸용)
export async function patchNickname(nickname: string) {
  const { data } = await axiosInstance.patch("/api/member/nickname", {
    nickname
  });
  return data;
}

// 관심 동네 (최초등록/수정 겸용)
export async function patchRegions(regionIds: number[]) {
  const { data } = await axiosInstance.patch("/api/member/regions", {
    regionIds
  });
  return data;
}

// 프로필 이미지 (최초등록/수정 겸용)
export async function patchProfileImage(file: File) {
  const fd = new FormData();
  fd.append("profileImage", file);
  // FormData는 Content-Type 수동 지정 금지(브라우저가 boundary 포함해 붙임)
  const { data } = await axiosInstance.patch("/api/member/profile-image", fd);
  return data;
}

// 온보딩 완료 플래그 (바디 없음)
export async function postOnboarding() {
  const { data } = await axiosInstance.post("/api/member/onboarding");
  return data;
}
