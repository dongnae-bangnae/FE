import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Profile from "../assets/icon-defaultProfile.svg";
import RingIcon from "../assets/icon-ring.svg";
import SettingIcon from "../assets/icon-setting.svg";
import Header from "../components/common/Header";

function MyPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"saved" | "myPosts" | "pro">(
    "saved"
  );

  return (
    <>
      <Header title="마이페이지" underline={true} />
      <div style={{ height: "16px" }} />

      {/* 상단바 (알림 + 설정 아이콘 그룹) */}
      <div className="w-full flex justify-end items-center mt-6 mb-4 pr-4">
        <div className="flex items-center" style={{ gap: "9px" }}>
          <img
            src={RingIcon}
            alt="알림"
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
            onClick={() => navigate("/mypage/notifications")}
          />
          <img
            src={SettingIcon}
            alt="설정"
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              marginRight: "10px"
            }}
            onClick={() => navigate("/mypage/settings")}
          />
        </div>
      </div>

      {/* 프로필 */}
      <div className="flex flex-col items-center">
        <img
          src={Profile}
          alt="프로필"
          className="w-20 h-20 rounded-full mb-2"
        />
        <p className="text-lg font-semibold">@기영이</p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex justify-center gap-x-3 mt-4">
        <button
          onClick={() => setSelectedTab("saved")}
          className={`w-[90px] h-8 rounded-lg text-sm font-medium
      ${selectedTab === "saved" ? "bg-[#F59E0B] text-white" : "bg-[#E5E5E5] text-black"}`}
        >
          저장
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("myPosts")}
          className={`w-[90px] h-8 rounded-lg text-sm font-medium
      ${selectedTab === "myPosts" ? "bg-[#F59E0B] text-white" : "bg-[#E5E5E5] text-black"}`}
        >
          내 글
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("pro")}
          className={`w-[90px] h-8 rounded-lg text-sm font-medium
      ${selectedTab === "pro" ? "bg-[#F59E0B] text-white" : "bg-[#E5E5E5] text-black"}`}
        >
          PRO 구독
        </button>
      </div>

      <div style={{ height: "16px" }} />
      <div className="w-full mt-4 border-b border-[#E5E5E5]" />

      {/* 저장 탭을 눌렀을 때 */}
      {/* {selectedTab === "saved" && (
        <div className="w-full mt-6 flex flex-col gap-3">

        </div>
      )} */}
    </>
  );
}
export default MyPage;
