import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import NotificationItem from "../components/NotificationItem";
import { useDeleteCommentNotification } from "../hooks/mutations/useDeleteCommentNotification";
import { useCommentNotifications } from "../hooks/queries/useCommentNotification";

const NotificationPage = () => {
  const [tab, setTab] = useState<"comment" | "ad">("comment");

  const { data, isLoading } = useCommentNotifications();
  const { mutate: deleteNotification } = useDeleteCommentNotification();

  // 댓글 알림 삭제 핸들러
  const handleDelete = (notificationId: number) => {
    deleteNotification(notificationId, {
      onSuccess: () => {
        // 삭제 후 refetch 없이 수동으로 제거
        if (!data) return;
        data.notifications = data.notifications.filter(
          (item) => item.notificationId !== notificationId
        );
      }
    });
  };

  return (
    <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen">
      <Header title="내 소식" underline={false} bgColor="bg-[#F3F4F5]" />

      {/* 탭 네비게이션 */}
      <div className="flex justify-around items-center pt-2 relative bg-[#F3F4F5]">
        <button
          onClick={() => setTab("comment")}
          className={`pb-2 text-sm font-medium ${
            tab === "comment" ? "text-black" : "text-[#888888]"
          }`}
        >
          댓글
        </button>
        <button
          onClick={() => setTab("ad")}
          className={`pb-2 text-sm font-medium ${
            tab === "ad" ? "text-black" : "text-[#888888]"
          }`}
        >
          광고 의심
        </button>
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
        {tab === "comment" ? (
          isLoading ? (
            <div>불러오는 중...</div>
          ) : (
            data?.notifications.map((item) => (
              <NotificationItem
                key={item.notificationId}
                item={{
                  id: item.notificationId,
                  type: "comment",
                  articleId: item.articleId,
                  articleTitle: item.articleTitle,
                  commentId: item.commentId,
                  commentContent: item.commentContent,
                  commenterNickname: item.commenterNickname
                }}
                onDelete={() => handleDelete(item.notificationId)}
              />
            ))
          )
        ) : (
          <div className="text-sm text-gray-500">
            광고 의심 탭은 아직 준비 중입니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
