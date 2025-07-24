import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StarIcon from "../assets/category-star.svg";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import PencilIcon from "../assets/icon-pencil.svg";
import RingIcon from "../assets/icon-ring.svg";
import SettingIcon from "../assets/icon-setting.svg";
import Header from "../components/common/Header";
import MyPostItem from "../components/MyPostItem";
import { CategoryColorName } from "../types/categoryColors";
import { getColorCode } from "../utils/getColorCode";

function MyPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"saved" | "myPosts" | "pro">(
    "saved"
  );

  const savedCategories: { name: string; color: CategoryColorName }[] = [
    { name: "종로 3가", color: "green" },
    { name: "상수동", color: "orange" },
    { name: "연남동", color: "yellow" }
  ];

  const myPostCategories: { name: string; color: CategoryColorName }[] = [
    { name: "종로 3가", color: "green" },
    { name: "상수동", color: "orange" },
    { name: "연남동", color: "yellow" }
  ];

  return (
    <>
      <Header title="마이 페이지" underline={true} />
      <div style={{ height: "16px" }} />

      {/* 상단바 (알림 + 설정 아이콘 그룹) */}
      <div className="w-full flex justify-end items-center mt-1 mb-4">
        <div className="flex items-center" style={{ gap: "9px" }}>
          <img
            src={RingIcon}
            alt="알림"
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
            onClick={() => navigate("/mypage/notification")}
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
          className="w-20 h-20d rounded-full mb-3"
        />
        <p className="text-md font-semibold">@기영이</p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setSelectedTab("saved")}
          className={`w-[90px] h-9 rounded-lg text-sm font-medium
      ${selectedTab === "saved" ? "bg-[#FFC064]" : "bg-[#D9D9D99E] text-black"}`}
        >
          저장
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("myPosts")}
          className={`w-[90px] h-9 rounded-lg text-sm font-medium
      ${selectedTab === "myPosts" ? "bg-[#FFC064]" : "bg-[#D9D9D99E] text-black"}`}
        >
          내 글
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("pro")}
          className={`w-[90px] h-9 rounded-lg text-sm font-medium
      ${selectedTab === "pro" ? "bg-[#FFC064]" : "bg-[#D9D9D99E] text-black"}`}
        >
          PRO 구독
        </button>
      </div>

      {/* 구분선 */}
      <div className="w-[357px] mt-4 mx-auto border-b border-[#999]" />

      {/* 저장 탭 */}
      {selectedTab === "saved" && (
        <div className="w-full px-5 mt-6">
          {savedCategories.map((cat) => (
            <MyPostItem
              key={cat.name}
              name={cat.name}
              image={StarIcon}
              color={getColorCode(cat.color)}
              onClick={() => navigate(`/mypage/saved/${cat.name}`)} // 저장 장소 상세 페이지로 이동
            />
          ))}
        </div>
      )}

      {/* 내 글 탭 */}
      {selectedTab === "myPosts" && (
        <div className="w-full px-5 mt-6">
          {myPostCategories.map((cat) => (
            <MyPostItem
              key={cat.name}
              name={cat.name}
              image={PencilIcon}
              color={getColorCode(cat.color)}
              onClick={() => navigate(`/mypage/locationposts`)}
            />
          ))}
        </div>
      )}
    </>
  );
}
export default MyPage;
