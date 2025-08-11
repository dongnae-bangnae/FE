import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { NotificationType } from "../types/notification";

interface Props {
  item: NotificationType;
  onDelete: () => void;
}

const NotificationItem = ({ item, onDelete }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === "comment") {
      navigate(`/record/${item.articleId}/comments`, {
        state: { focusCommentId: item.commentId } // 옵션: 페이지에서 사용하면 해당 댓글로 스크롤
      });
      return;
    }

    if (item.type === "ad" && item.spamCount == 10) {
      navigate(`/record/${item.articleId}`);
    }
  };

  const getSubText = () => {
    if (item.type === "ad") {
      if (item.spamCount == 20) return "게시물이 자동으로 삭제되었습니다.";
      if (item.spamCount == 10)
        return "20회 누적 시, 게시물은 자동으로 삭제됩니다.";
    }
    return "";
  };

  return (
    <div
      className="relative bg-white px-4 py-3 border-b border-[#888888] cursor-pointer"
      onClick={handleClick}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 text-[#999] hover:text-black"
      >
        <IoClose size={18} />
      </button>

      {/* 본문 */}
      <div className="text-sm leading-snug">
        {item.type === "comment" ? (
          <>
            <b className="text-[#FF7A00]">{item.commenterNickname}</b>님이{" "}
            <b>{item.articleTitle}</b> 글에 <b>댓글</b>을 남겼습니다.
            {item.commentContent && (
              <p className="text-xs text-[#999999] mt-1">
                {item.commentContent}
              </p>
            )}
          </>
        ) : (
          <>
            <b>{item.articleTitle}</b> 글, 광고 의심{" "}
            <span className="text-[#FF7A00] font-semibold">
              {item.spamCount}회
            </span>
            {getSubText() && (
              <p className="text-xs text-[#999] mt-1">{getSubText()}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
