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
      <Header title="내 소식" underline />

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setTab("comment")}
          className={`w-[100px] h-[40px] rounded-lg text-sm font-medium ${
            tab === "comment" ? "bg-[#FFAC33]" : "bg-[#D9D9D99E] text-black"
          }`}
        >
          댓글
        </button>

        <div style={{ width: "17px" }} />

        <button
          onClick={() => setTab("ad")}
          className={`w-[100px] h-[40px] rounded-lg text-sm font-medium ${
            tab === "ad" ? "bg-[#FFAC33]" : "bg-[#D9D9D99E] text-black"
          }`}
        >
          광고 의심
        </button>
      </div>

      {/* 구분선 */}
      <div className="w-full px-4 mt-4">
        <div className="w-full border-b border-[#E5E5E5]" />
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
