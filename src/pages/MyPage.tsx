import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DefaultProfile from "../assets/icon-defaultProfile.svg";
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
      <Header title="마이 페이지" underline={true} />
      <div style={{ height: "16px" }} />

      {/* 상단바 (알림 + 설정 아이콘 그룹) */}
      <div className="w-full flex justify-end items-center mt-2 mb-4 pr-2">
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
            onClick={() => navigate("/mypage/profile")}
          />
        </div>
      </div>

      {/* 프로필 */}
      <div className="flex flex-col items-center">
        <img
          src={DefaultProfile}
          alt="프로필"
          className="w-24 h-24 rounded-full mb-2"
        />
        <p className="text-lg font-semibold">@기영이</p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setSelectedTab("saved")}
          className={`w-[90px] h-8 rounded-lg text-sm font-medium
      ${selectedTab === "saved" ? "bg-[#FFC064]" : "bg-[#D9D9D99E] text-black"}`}
        >
          저장
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("myPosts")}
          className={`w-[90px] h-8 rounded-lg text-sm font-medium
      ${selectedTab === "myPosts" ? "bg-[#FFC064]" : "bg-[#D9D9D99E] text-black"}`}
        >
          내 글
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("pro")}
          className={`w-[90px] h-8 rounded-lg text-sm font-medium
      ${selectedTab === "pro" ? "bg-[#FFC064]" : "bg-[#D9D9D99E] text-black"}`}
        >
          PRO 구독
        </button>
      </div>

      {/* 구분선 */}
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
