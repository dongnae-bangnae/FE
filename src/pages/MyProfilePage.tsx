import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import DefaultProfile from "../assets/icon-defaultProfile.svg";
import NextIcon from "../assets/icon-next.svg";
import Header from "../components/common/Header";
import ConfirmModal from "../components/ConfirmModal";

function MyProfilePage() {
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileUrl(previewUrl);
    }
  };

  const handleLogout = () => {
    // 1. localStorage에서 로그인 관련 정보 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user"); // 사용자 정보 저장해뒀다면 함께 제거

    // 2. 로그인 페이지로 이동
    navigate("/login", { replace: true });
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
          <div className="w-full mt-4 mb-8 border-b border-[#E5E5E5]" />

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
            <button onClick={() => navigate("/mypage/profile/area")}>
              <img src={NextIcon} alt=">" className="w-3 h-3 mr-2" />
            </button>
          </div>

          {/* 관심 동네 태그 */}
          <div className="flex flex-wrap gap-2 mt-3 w-[340px]">
            <span className="bg-[#F3F4F6] text-sm text-black px-3 py-1 rounded-full">
              연남동 ✕
            </span>
            <span className="bg-[#F3F4F6] text-sm text-black px-3 py-1 rounded-full">
              종로 3가 ✕
            </span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] bg-white border-t border-[#E5E5E5] px-4 py-3 flex justify-center gap-3 z-50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-[120px] bg-[#E5E5E5] text-black py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-[#FFC064] transition-colors duration-200"
        >
          로그아웃
        </button>
        <button className="w-[120px] bg-[#E5E5E5] text-black py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-[#FFC064] transition-colors duration-200">
          회원탈퇴
        </button>
      </div>

      {showLogoutModal && (
        <ConfirmModal
          message="로그아웃 하시겠습니까?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}

export default MyProfilePage;
