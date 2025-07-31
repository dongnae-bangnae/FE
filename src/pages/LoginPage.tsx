import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import circleCheck from "../assets/icon-circleCheck.svg";
import googleIcon from "../assets/icon-google.svg";
import kakaoIcon from "../assets/icon-kakao.svg";
import naverIcon from "../assets/icon-naver.svg";
import logo from "../assets/logo.svg";

function LoginPage() {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState("");

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
    <div className="flex flex-col justify-center items-center h-screen bg-[#F95F00] text-white px-6">
      {/* 로고 */}
      <img src={logo} alt="로고" className="w-[101px] h-[100px] mb-10 mt-10" />

      {/* 소셜 로그인 버튼 */}
      <div className="flex space-x-[20px] mb-10">
        {/* Naver */}
        <button
          onClick={() => handleSocialLogin("naver")}
          className="flex items-center justify-center"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#03CF5D"
          }}
        >
          <img
            src={naverIcon}
            alt="Naver"
            style={{ width: "33px", height: "33px" }}
          />
        </button>

        {/* Kakao */}
        <button
          onClick={() => handleSocialLogin("kakao")}
          className="flex items-center justify-center"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#FEE102"
          }}
        >
          <img
            src={kakaoIcon}
            alt="Kakao"
            style={{ width: "33px", height: "33px" }}
          />
        </button>

        {/* Google */}
        <button
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF"
          }}
        >
          <img
            src={googleIcon}
            alt="Google"
            style={{ width: "33px", height: "33px" }}
          />
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
