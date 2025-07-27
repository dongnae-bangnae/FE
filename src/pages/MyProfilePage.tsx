import { ChangeEvent, useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import circleCheck from "../assets/icon-circleCheck.svg";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import NextIcon from "../assets/icon-next.svg";
import XIcon from "../assets/icon-x.svg";
import XActivateIcon from "../assets/icon-x-activate.svg";
import Header from "../components/common/Header";
import MypageModal from "../components/MypageModal";
import { usePatchProfileImage } from "../hooks/mutations/usePatchProfileImage";
import { useMyInfo } from "../hooks/queries/useMyInfo.ts";

function MyProfilePage() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const location = useLocation();

  const { data: myInfo } = useMyInfo();
  const { mutate: patchProfileImage } = usePatchProfileImage();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [areas, setAreas] = useState<string[]>([]);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 최대 10MB 제한
    if (file.size > 10 * 1024 * 1024) {
      setToastMessage("10MB 이하의 이미지만 업로드할 수 있어요");
      return;
    }

    patchProfileImage(file); // 성공 시 자동으로 invalidate → 이미지 리렌더됨
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

  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);

      // 2초 후 메시지 자동 사라짐
      const timer = setTimeout(() => {
        setToastMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    console.log("myInfo", myInfo);
    console.log("✅ myInfo.likePlaces", myInfo?.likePlaces);
    console.log("✅ areas", areas);
    if (myInfo?.likePlaces) {
      setAreas(myInfo.likePlaces.map((place) => place.name));
    }
  }, [myInfo]);

  return (
    <>
      <Header title="회원정보" underline={true} />

      {/* 전체 콘텐츠 영역 */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="w-[375px] h-[calc(100vh-56px-60px)] overflow-hidden flex flex-col items-center mt-10">
          {/* 프로필 사진 */}
          <label htmlFor="profile-upload" className="cursor-pointer">
            <img
              src={myInfo?.profileImage || DefaultProfile}
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
          <div className="w-[357px] mt-4 mx-auto mb-8 border-b border-[#999]" />

          {/* 닉네임 */}
          <div className="w-[340px] flex justify-between items-center py-2.5 border border-[#00000078] rounded-lg text-sm font-medium mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
            <span className="text-black px-4">닉네임</span>
            <div className="flex items-center">
              <span className="text-[#6B7280]">
                {myInfo?.nickname || "닉네임"}
              </span>
              <button onClick={() => navigate("/mypage/profile/nickname")}>
                <img src={NextIcon} alt=">" className="w-3 h-3 ml-1 mr-2" />
              </button>
            </div>
          </div>

          {/* 관심 동네 설정 */}
          <div className="w-[340px] flex justify-between items-center py-2.5 border border-[#00000078] rounded-lg text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
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
                className="group flex items-center gap-1 text-sm text-black px-2 py-[5px] rounded-full
      border border-[#B3B3B3] outline outline-[2px] outline-[#B3B3B3] outline-offset-[-2px]
      shadow-[0_2px_4px_rgba(0,0,0,0.25)]
      hover:border-[#FFA521] hover:outline-[#FFA521] hover:shadow-[0_2px_4px_rgba(255,151,0,0.87)] transition-all"
              >
                {area}
                <div
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => handleRemoveArea(area)}
                >
                  {/* hover 시 보여줄 아이콘 */}
                  <img
                    src={XActivateIcon}
                    alt="삭제"
                    className="hidden group-hover:block"
                  />
                  {/* 기본 상태 아이콘 */}
                  <img
                    src={XIcon}
                    alt="삭제"
                    className="block group-hover:hidden"
                  />
                </div>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[357px] bg-white border-t border-[#999999] px-6 py-4 flex justify-center gap-[17px] z-50">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-[105px] h-[40px] px-4 py-[10px] bg-[#ECECEC] hover:bg-[#FFB54D] text-black text-[14px] font-normal rounded-[9px] outline outline-[2px] outline-[#ECECEC] hover:outline-[#FFB54D] outline-offset-[-2px] shadow-[2px_2px_4px_rgba(245,245,245,0.75)] hover:shadow-[2px_2px_4px_rgba(255,170,51,0.25)] transition-all duration-200"
        >
          로그아웃
        </button>
        <button
          onClick={() => setShowDeleteAccountModal(true)}
          className="w-[105px] h-[40px] px-4 py-[10px] bg-[#ECECEC] hover:bg-[#FFB54D] text-black text-[14px] font-normal rounded-[9px] outline outline-[2px] outline-[#ECECEC] hover:outline-[#FFB54D] outline-offset-[-2px] shadow-[2px_2px_4px_rgba(245,245,245,0.75)] hover:shadow-[2px_2px_4px_rgba(255,170,51,0.25)] transition-all duration-200"
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

      {/* 토스트 메시지 영역 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[354px] px-4 py-2.5 bg-[#9A7B6F]/80 text-white text-sm rounded-lg flex items-center gap-2 z-50 shadow-md">
          <img src={circleCheck} alt="체크 아이콘" className="w-5 h-5" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default MyProfilePage;
