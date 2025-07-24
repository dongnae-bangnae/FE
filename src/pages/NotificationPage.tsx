import { useState } from "react";

import Header from "../components/common/Header";
import NotificationItem from "../components/NotificationItem";
import {
  adNotifications,
  commentNotifications
} from "../dummyData/notificationData";

const NotificationPage = () => {
  const [tab, setTab] = useState<"comment" | "ad">("comment");
  const [comments, setComments] = useState(commentNotifications);
  const [ads, setAds] = useState(adNotifications);

  const handleDelete = (id: number) => {
    if (tab === "comment") {
      setComments((prev) => prev.filter((item) => item.id !== id));
    } else {
      setAds((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen">
      <Header title="내 소식" underline={false} bgColor="bg-[#F3F4F5]" />

      {/* 탭 네비게이션 */}
      <div className="flex justify-around items-center pt-2 relative bg-[#F3F4F5]">
        {/* 댓글 탭 */}
        <button
          onClick={() => setTab("comment")}
          className={`pb-2 text-sm font-medium ${
            tab === "comment" ? "text-black" : "text-[#888888]"
          }`}
        >
          댓글
        </button>

        {/* 광고 의심 탭 */}
        <button
          onClick={() => setTab("ad")}
          className={`pb-2 text-sm font-medium ${
            tab === "ad" ? "text-black" : "text-[#888888]"
          }`}
        >
          광고 의심
        </button>

        {/* 하단 바 (주황색) */}
        <div
          className={`absolute bottom-0 h-[2px] bg-[#FFA521] transition-all duration-300`}
          style={{
            width: "140px",
            left:
              tab === "comment" ? "calc(25% - 70px - 4px)" : "calc(75% - 75px)"
          }}
        />
      </div>

      {/* 구분선 */}
      <div className="w-full px-4">
        <div className="w-full border-b border-[#888888]" />
      </div>

      {/* 알림 목록 */}
      <div className="p-4 flex flex-col gap-3">
        {(tab === "comment" ? comments : ads).map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
