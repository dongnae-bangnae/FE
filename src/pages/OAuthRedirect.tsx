import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 쿼리 파라미터 추출
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const isOnboardingCompleted = query.get("isOnboardingCompleted") === "true";

    if (accessToken && refreshToken) {
      // 로컬스토리지에 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 온보딩 완료 여부에 따라 이동
      if (isOnboardingCompleted) {
        navigate("/home");
      } else {
        navigate("/onboard");
      }
    } else {
      // 토큰 없으면 에러 페이지나 로그인으로
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
