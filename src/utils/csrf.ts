import { axiosInstance } from "../apis/axiosInstance";

/**
 * CSRF 토큰을 미리 가져오는 함수
 * 온보딩 페이지나 다른 중요한 페이지 진입 시 호출
 */
export const ensureCSRFToken = async (): Promise<boolean> => {
  try {
    // CSRF 토큰이 이미 있는지 확인
    const existingToken = getCookieValue("XSRF-TOKEN");
    if (existingToken) {
      console.log("CSRF token already exists:", existingToken);
      return true;
    }

    // CSRF 토큰을 가져오기 위한 GET 요청
    // 보통 /api/csrf 또는 메인 페이지 등에서 토큰을 발급받을 수 있음
    await axiosInstance.get("/api/csrf"); // 실제 엔드포인트에 맞게 수정 필요

    const newToken = getCookieValue("XSRF-TOKEN");
    if (newToken) {
      console.log("CSRF token obtained:", newToken);
      return true;
    }

    console.warn("Failed to obtain CSRF token");
    return false;
  } catch (error) {
    console.error("Error obtaining CSRF token:", error);
    return false;
  }
};

/**
 * 쿠키에서 값을 읽는 유틸리티 함수
 */
function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? m[2] : null;
}
