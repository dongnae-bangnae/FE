import { useState } from "react";

import Header from "../components/common/Header";
import NotificationItem from "../components/NotificationItem";
import { useDeleteAdNotification } from "../hooks/mutations/useDeleteAdNotification";
import { useDeleteCommentNotification } from "../hooks/mutations/useDeleteCommentNotification";
import { useCommentNotification } from "../hooks/queries/useCommentNotification";
import { useFetchAdNotification } from "../hooks/queries/useFetchAdNotification";

const NotificationPage = () => {
  const [tab, setTab] = useState<"comment" | "ad">("comment");

  // 댓글 알림
  const { data: commentData, isLoading: isCommentLoading } =
    useCommentNotification();
  const { mutate: deleteCommentNotification } = useDeleteCommentNotification();

  // 광고 의심 알림
  const { data: adData, isLoading: isAdLoading } = useFetchAdNotification();
  const { mutate: deleteAdNotification } = useDeleteAdNotification();

  // 댓글 알림 삭제
  const handleDeleteComment = (notificationId: number) => {
    deleteCommentNotification(notificationId, {
      onSuccess: () => {
        if (!commentData) return;
        commentData.notifications = commentData.notifications.filter(
          (item) => item.notificationId !== notificationId
        );
      }
    });
  };

  // 광고 의심 알림 삭제
  const handleDeleteAd = (notificationId: number) => {
    deleteAdNotification(notificationId, {
      onSuccess: () => {
        if (!adData) return;
        adData.notifications = adData.notifications.filter(
          (item) => item.notificationId !== notificationId
        );
      }
    });
  };

  return (
    <div className="w-full max-w-[375px] mx-auto bg-white min-h-screen">
      <Header title="내 소식" underline={false} bgColor="bg-[#F3F4F5]" />

      {/* 탭 */}
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
          className="absolute bottom-0 h-[2px] bg-[#FFA521] transition-all duration-300"
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
          isCommentLoading ? (
            <div>불러오는 중...</div>
          ) : (
            commentData?.notifications.map((item) => (
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
                onDelete={() => handleDeleteComment(item.notificationId)}
              />
            ))
          )
        ) : isAdLoading ? (
          <div>불러오는 중...</div>
        ) : (
          adData?.notifications.map((item) => (
            <NotificationItem
              key={item.notificationId}
              item={{
                id: item.notificationId,
                type: "ad",
                articleId: item.articleId,
                articleTitle: item.articleTitle,
                spamCount: item.spamCount
              }}
              onDelete={() => handleDeleteAd(item.notificationId)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
