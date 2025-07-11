import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import naverIcon from "../assets/icon-naver.svg";
import kakaoIcon from "../assets/icon-kakao.svg";
import googleIcon from "../assets/icon-google.svg";

function LoginPage() {
  const navigate = useNavigate();

  const handleSocialLogin = (provider: "naver" | "kakao" | "google") => {
    navigate(`/oauth2/authorization/${provider}`);
  };

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

      {/* 일반 로그인 / 회원가입 */}
      <div className="text-center text-[17px] font-semibold leading-[1.5] space-x-2">
        <button>일반 로그인</button>
        <span>|</span>
        <button>일반 회원가입</button>
      </div>
    </div>
  );
}

export default LoginPage;
