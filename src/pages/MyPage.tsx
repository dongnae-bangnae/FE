import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DefaultProfile from "../assets/icon-defaultProfile.svg";
import RingIcon from "../assets/icon-ring.svg";
import SettingIcon from "../assets/icon-setting.svg";
import CategoryItem from "../components/common/CategoryItem.tsx";
import Header from "../components/common/Header";
import { useMyCategories } from "../hooks/queries/useMyCategories.ts";
import { useMyInfo } from "../hooks/queries/useMyInfo.ts";
import { CategoryColorName } from "../types/categoryColors";
import { getColorCode } from "../utils/getColorCode";

function MyPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"saved" | "myPosts" | "pro">(
    "saved"
  );
  const { data: myInfo, isLoading } = useMyInfo();

  const { data: myCategories } = useMyCategories();

  // const savedCategories: { name: string; color: CategoryColorName }[] = [
  //   { name: "종로 3가", color: "green" },
  //   { name: "상수동", color: "orange" },
  //   { name: "연남동", color: "yellow" }
  // ];

  // const myPostCategories: { name: string; color: CategoryColorName }[] = [
  //   { name: "종로 3가", color: "green" },
  //   { name: "상수동", color: "orange" },
  //   { name: "연남동", color: "yellow" }
  // ];

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
              width: "24px",
              height: "24px",
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
          src={myInfo?.profileImage || DefaultProfile}
          alt="프로필"
          className="w-20 h-20 rounded-full mb-3 object-cover"
        />
        <p className="text-md font-semibold">@{myInfo?.nickname || "닉네임"}</p>
      </div>

      {/* 탭 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setSelectedTab("saved")}
          className={`w-[90px] h-9 text-center text-black font-medium text-[14px] rounded-[10px]
            shadow-[0_2px_4px_rgba(0,0,0,0.25)]
            ${
              selectedTab === "saved" ? "bg-[#FFC064]" : "bg-[#D9D9D980]"
            } transition-all duration-200`}
        >
          저장
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("myPosts")}
          className={`w-[90px] h-9 text-center text-black font-medium text-[14px] rounded-[10px]
            shadow-[0_2px_4px_rgba(0,0,0,0.25)]
            ${
              selectedTab === "myPosts" ? "bg-[#FFC064]" : "bg-[#D9D9D980]"
            } transition-all duration-200`}
        >
          내 글
        </button>

        <div style={{ width: "20px" }} />

        <button
          onClick={() => setSelectedTab("pro")}
          className={`w-[90px] h-9 text-center text-black font-medium text-[14px] rounded-[10px]
            shadow-[0_2px_4px_rgba(0,0,0,0.25)]
            ${
              selectedTab === "pro" ? "bg-[#FFC064]" : "bg-[#D9D9D980]"
            } transition-all duration-200`}
        >
          PRO 구독
        </button>
      </div>

      {/* 구분선 */}
      <div className="w-[357px] mt-4 mx-auto border-b border-[#999]" />

      {/* 저장 탭 */}
      {selectedTab === "saved" &&
        (myCategories && myCategories.length > 0 ? (
          <div className="w-full px-5 mt-6">
            {myCategories.map((cat) => (
              <CategoryItem
                key={cat.name}
                name={cat.name}
                color={getColorCode(cat.color)}
                onClick={() =>
                  navigate(`/mypage/saved/${cat.categoryId}`, {
                    state: { categoryName: cat.name }
                  })
                }
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-center text-gray-500 mt-10">
              장소를 저장해 보세요!
            </p>
          )
        ))}

      {/* 내 글 탭 */}
      {selectedTab === "myPosts" &&
        (myCategories && myCategories.length > 0 ? (
          <div className="w-full px-5 mt-6">
            {myCategories.map((cat) => (
              <CategoryItem
                key={cat.name}
                name={cat.name}
                color={getColorCode(cat.color)}
                iconType="pencil"
                onClick={() =>
                  navigate(`/mypage/locationposts/${cat.categoryId}`, {
                    state: { categoryName: cat.name }
                  })
                }
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <p className="text-center text-gray-500 mt-10">
              게시물을 작성해 보세요!
            </p>
          )
        ))}
    </>
  );
}
export default MyPage;
