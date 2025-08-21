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

// 동네 검색
export type RegionSearchItem = {
  regionId: number;
  province: string;
  city: string;
  district: string;
};

export async function searchRegions(params: {
  keyword: string;
  cursor?: number | null;
  limit?: number;
}) {
  const { data } = await axiosInstance.get("/api/regions/search", {
    params
  });
  // data.result.regions: RegionSearchItem[]
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

// 닉네임 중복/유효성 검사 (JWT 필요)
// - 200: 사용 가능 (자기 닉네임도 OK)
// - 400: 에러코드로 사유 전달
export async function checkNicknameAvailability(nickname: string): Promise<{
  available: boolean; // 사용 가능 여부
  message?: string; // 사용자에게 보여줄 메시지
  selfNicknameOk?: boolean; // 자기 닉네임 허용 케이스
}> {
  try {
    const { data } = await axiosInstance.post("/api/member/check-nickname", {
      nickname
    });
    // 예시 응답(성공):
    // { isSuccess:true, code:"MEMBER2011", message:"사용 가능한 닉네임입니다.", result:{ memberId:111, nickname:"지니카카오" } }
    return {
      available: true,
      message: data?.message ?? "사용 가능한 닉네임입니다.",
      selfNicknameOk: !!data?.result?.memberId
    };
  } catch (err: any) {
    const code = err?.response?.data?.code as string | undefined;
    const msg =
      err?.response?.data?.result?.nickname ?? err?.response?.data?.message;

    // 스펙(이미지) 기준 에러 코드 매핑
    const EMPTY_CODES = ["COMMONA0000", "NICKNAME_NOT_EXIST", "EMPTY_NICKNAME"];
    const LENGTH_CODES = ["COMMONA4000", "NICKNAME_LENGTH_EXCEEDED"];
    const DUP_CODES = ["MEMBER4008", "NICKNAME_DUPLICATE", "MEMBERA008"];

    if (EMPTY_CODES.includes(code ?? "")) {
      return { available: false, message: "닉네임을 입력해주세요" };
    }
    if (LENGTH_CODES.includes(code ?? "")) {
      return { available: false, message: "닉네임은 최대 10자입니다." };
    }
    if (DUP_CODES.includes(code ?? "")) {
      return { available: false, message: "이미 사용 중인 닉네임입니다." };
    }
    // 예외: 알 수 없는 400/기타
    return {
      available: false,
      message: msg ?? "닉네임 확인 중 오류가 발생했어요."
    };
  }
}

// 온보딩 통합 등록 (nickname + chosenRegionIds + profileImage)
export async function submitOnboarding(params: {
  nickname: string;
  chosenRegionIds: number[];
  profileImage?: File | null;
}) {
  const { nickname, chosenRegionIds, profileImage } = params;

  const fd = new FormData();

  // request(JSON) 파트: 명세서의 필드명 그대로 'request'
  const requestBlob = new Blob(
    [JSON.stringify({ nickname, chosenRegionIds })],
    { type: "application/json" }
  );
  fd.append("request", requestBlob);

  // 선택 파일
  if (profileImage) {
    fd.append("profileImage", profileImage);
  }

  const { data } = await axiosInstance.post("/api/member/onboarding", fd);
  return data; // { isSuccess, code, message, result: { memberId, nickname, profileImage, chosenRegionIds, isOnboardingCompleted } }
}
