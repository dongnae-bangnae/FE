import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function OAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // 온보딩 여부만 보고 라우팅
    const isOnboardingCompleted =
      getCookieValue("isOnboardingCompleted") === "true";

    if (isOnboardingCompleted === true) navigate("/home");
    else if (isOnboardingCompleted === false) navigate("/onboard");
    else navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      로그인 중입니다...
    </div>
  );
}

export default OAuthRedirect;
