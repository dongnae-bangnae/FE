import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import circleCheck from "../assets/icon-circleCheck.svg";
import googleIcon from "../assets/icon-google.svg";
import kakaoIcon from "../assets/icon-kakao.svg";
import naverIcon from "../assets/icon-naver.svg";
import logo from "../assets/logo2.svg";
// import OnBoardingLoadingSpinner from "../components/OnBoardingLoadingSpinner";

function LoginPage() {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState("");
  // const [authLoading, setAuthLoading] = useState(false);

  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    const loginUrls = {
      naver: import.meta.env.VITE_NAVER_LOGIN_URL,
      kakao: import.meta.env.VITE_KAKAO_LOGIN_URL,
      google: import.meta.env.VITE_GOOGLE_LOGIN_URL
    };

    const redirectUrl = loginUrls[provider];

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      console.error(`Login URL for ${provider} is not defined`);
    }
  };
  //   if (!redirectUrl) {
  //     console.error(`Login URL for ${provider} is not defined`);
  //     return;
  //   }

  //   setAuthLoading(true); // 스피너 켜기
  //   requestAnimationFrame(() => {
  //     requestAnimationFrame(() => {
  //       window.location.href = redirectUrl;
  //     });
  //   });
  // };

  // if (authLoading) {
  //   return (
  //     <div className="min-h-screen bg-white">
  //       <OnBoardingLoadingSpinner overlay={false} />
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);

      const timer = setTimeout(() => {
        setToastMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-[#FFAC33] text-white px-6">
      {/* 로고: 위에서 253px 위치 + 지정 사이즈 */}
      <img
        src={logo}
        alt="로고"
        className="mt-[253px]"
        style={{ width: "135.9px", height: "135px" }}
      />

      {/* 소셜 로그인 버튼 */}
      <div className="absolute bottom-[230px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-[29px]">
        {/* Naver */}
        <button
          onClick={() => handleSocialLogin("naver")}
          className="w-[60px] h-[60px] p-0 rounded-full active:scale-95"
          aria-label="네이버로 로그인"
        >
          <img src={naverIcon} alt="Naver" className="w-full h-full" />
        </button>

        {/* Kakao */}
        <button
          onClick={() => handleSocialLogin("kakao")}
          className="w-[60px] h-[60px] p-0 rounded-full active:scale-95"
          aria-label="카카오로 로그인"
        >
          <img src={kakaoIcon} alt="Kakao" className="w-full h-full" />
        </button>

        {/* Google */}

        <button
          onClick={() => handleSocialLogin("google")}
          className="w-[60px] h-[60px] p-0 rounded-full active:scale-95"
          aria-label="구글로 로그인"
        >
          <img src={googleIcon} alt="Google" className="w-full h-full" />
        </button>
      </div>

      {/* 토스트 메시지 영역 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[354px] px-4 py-2.5 bg-[#9A7B6F]/80 text-white text-sm rounded-lg flex items-center gap-2 z-50 shadow-md">
          <img src={circleCheck} alt="체크 아이콘" className="w-5 h-5" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
