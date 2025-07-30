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
    const accessToken = getCookieValue("accessToken");
    const refreshToken = getCookieValue("refreshToken");
    const isOnboardingCompleted =
      getCookieValue("isOnboardingCompleted") === "true";

    // ✅ 쿠키 값 콘솔 출력
    console.log("🍪 cookie:", document.cookie);
    console.log("👉 accessToken:", accessToken);
    console.log("👉 refreshToken:", refreshToken);
    console.log("👉 isOnboardingCompleted:", isOnboardingCompleted);

    // 👉 토큰 저장
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    // 👉 온보딩 분기
    if (isOnboardingCompleted !== null) {
      if (isOnboardingCompleted) {
        navigate("/home");
      } else {
        navigate("/onboard");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      로그인 중입니다...
    </div>
  );
}

export default OAuthRedirect;
