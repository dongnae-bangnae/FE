import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function getCookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function OAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    //  1. 쿠키에서 토큰 추출
    const accessToken = getCookieValue("accessToken"); // 사용 안 하지만 참고
    const refreshToken = getCookieValue("refreshToken"); // 사용 안 하지만 참고
    const csrfToken = getCookieValue("XSRF-TOKEN");
    const isOnboardingCompleted =
      getCookieValue("isOnboardingCompleted") === "true";

    //  2. CSRF 토큰 저장 + axios 헤더 설정
    if (csrfToken) {
      localStorage.setItem("XSRF-TOKEN", csrfToken);
      axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken;
    }

    //  3. 온보딩 여부에 따라 이동
    if (isOnboardingCompleted !== null) {
      if (isOnboardingCompleted) {
        navigate("/home");
      } else {
        navigate("/onboard");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      로그인 중입니다...
    </div>
  );
}

export default OAuthRedirect;
