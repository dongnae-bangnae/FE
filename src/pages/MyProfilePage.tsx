import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import DefaultProfile from "../assets/icon-defaultProfile.svg";
import NextIcon from "../assets/icon-next.svg";
import XIcon from "../assets/icon-x.svg";
import Header from "../components/common/Header";
import MypageModal from "../components/MypageModal";

function MyProfilePage() {
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [areas, setAreas] = useState<string[]>(["연남동", "종로 3가"]);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileUrl(previewUrl);
    }
  };

  const handleLogout = () => {
    // localStorage에서 로그인 관련 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user"); // 사용자 정보 저장해뒀다면 함께 제거

    // 로그인 페이지로 이동
    navigate("/", {
      replace: true,
      state: { message: "로그아웃되었어요" }
    });
  };

  const handleDeleteAccount = () => {
    // 회원탈퇴 API 여기서 호출 예정
    console.log("회원 탈퇴 처리");

    // 계정 정보 초기화
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // 로그인 페이지로 이동
    navigate("/", {
      replace: true,
      state: { message: "회원탈퇴가 완료되었어요" }
    });
  };

  const handleRemoveArea = (area: string) => {
    setAreas((prev) => prev.filter((item) => item !== area));
  };

  return (
    <>
      <Header title="회원정보" underline={true} />

      {/* 전체 콘텐츠 영역 */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="w-[375px] h-[calc(100vh-56px-60px)] overflow-hidden flex flex-col items-center mt-10">
          {/* 프로필 사진 */}
          <label htmlFor="profile-upload" className="cursor-pointer">
            <img
              src={profileUrl || DefaultProfile}
              alt="프로필"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            className="hidden"
            onChange={handleProfileChange}
          />

          {/* 구분선 */}
          <div className="w-full mt-4 mb-8 border-b border-[#999]" />

          {/* 닉네임 */}
          <div className="w-[340px] flex justify-between items-center py-2.5 border border-[#D1D5DB] rounded-lg text-sm font-medium mb-3">
            <span className="text-black px-4">닉네임</span>
            <div className="flex items-center">
              <span className="text-[#6B7280]">푸짐바오</span>
              <button onClick={() => navigate("/mypage/profile/nickname")}>
                <img src={NextIcon} alt=">" className="w-3 h-3 ml-1 mr-2" />
              </button>
            </div>
          </div>

          {/* 관심 동네 설정 */}
          <div className="w-[340px] flex justify-between items-center py-2.5 border border-[#D1D5DB] rounded-lg text-sm font-medium">
            <span className="text-black px-4">관심 동네 설정</span>
            <button onClick={() => navigate("/mypage/profile/likeplace")}>
              <img src={NextIcon} alt=">" className="w-3 h-3 mr-2" />
            </button>
          </div>

          {/* 관심 동네 태그 */}
          <div className="flex flex-wrap gap-2 mt-3 w-[340px]">
            {areas.map((area) => (
              <span
                key={area}
                className="flex items-center gap-1 text-sm text-black px-3 py-1 rounded-full border border-gray-300"
              >
                {area}
                <img
                  src={XIcon}
                  alt="삭제"
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleRemoveArea(area)}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] bg-white border-t border-[#D9D9D9] px-6 py-4 flex justify-center gap-[17px] z-50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-[105px] h-[40px] px-4 py-[10px] bg-[#ECECEC] hover:bg-[#FFB54D] text-black text-[15px] font-normal rounded-[9px] outline outline-[2px] outline-[#ECECEC] hover:outline-[#FFB54D] outline-offset-[-2px] shadow-[2px_2px_4px_rgba(245,245,245,0.75)] hover:shadow-[2px_2px_4px_rgba(255,170,51,0.25)] transition-all duration-200"
        >
          로그아웃
        </button>
        <button
          onClick={() => setShowDeleteAccountModal(true)}
          className="w-[105px] h-[40px] px-4 py-[10px] bg-[#ECECEC] hover:bg-[#FFB54D] text-black text-[15px] font-normal rounded-[9px] outline outline-[2px] outline-[#ECECEC] hover:outline-[#FFB54D] outline-offset-[-2px] shadow-[2px_2px_4px_rgba(245,245,245,0.75)] hover:shadow-[2px_2px_4px_rgba(255,170,51,0.25)] transition-all duration-200"
        >
          회원탈퇴
        </button>
      </div>

      {showLogoutModal && (
        <MypageModal
          title="로그아웃하시겠어요?"
          description="다시 로그인해야 앱을 이용할 수 있어요"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
          confirmText="로그아웃"
          cancelText="취소"
        />
      )}

      {showDeleteAccountModal && (
        <MypageModal
          title="회원 탈퇴하시겠어요?"
          description="삭제된 모든 정보는 복구할 수 없어요"
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteAccountModal(false)}
          confirmText="회원탈퇴"
          cancelText="취소"
        />
      )}
    </>
  );
}

export default MyProfilePage;
