import MenuBarIcon from "../../assets/record/icon-menubar.svg";
import DefaultProfileIcon from "../../assets/icon-defaultProfile.svg";
import ResponseIcon from "../../assets/record/icon-comment.svg";
import fonts from "../../styles/fonts";
import { useState } from "react";
import CommentModal from "./CommentModal";

interface CommentItemProps {
  nickname: string;
  content: string;
  showReplyButton?: boolean;
  onReplyClick?: () => void;
  children?: React.ReactNode;
  isReply?: boolean;
  isMine?: boolean;
  profileImage?: string,
}

const CommentItem = ({
  nickname,
  content,
  showReplyButton = true,
  onReplyClick,
  children,
  isReply = false,
  isMine = true, //임시
}: CommentItemProps) => {
   
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="border rounded-xl w-full max-w-[355px]"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.47)",
        marginTop: isReply ? "10px" : 0,
      }}
    >
      {/* 프로필 + 닉네임 */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-2 ml-2 mt-2">
          {isReply && (
            <img src={ResponseIcon} alt="response" className="w-[18px] h-[18px]" />
          )}
          <img
            src={DefaultProfileIcon}
            alt="avatar"
            className="w-[25px] h-[25px] rounded-full"
          />
          <span
            className="text-sm"
            style={{
              fontSize: fonts.size.caption,
              fontWeight: fonts.weight.regular,
            }}
          >
            @{nickname}
          </span>
        </div>
        <button className="mr-[12px]"
                onClick={() => setShowModal(true)}
        >
          <img src={MenuBarIcon} />
        </button>

        {/* 모달 렌더링 */}
        {showModal && isMine && (
            <CommentModal
            onClose={() => setShowModal(false)}
            onEdit={() => {
                alert("수정 기능 연결 예정");
                setShowModal(false);
            }}
            onDelete={() => {
                alert("삭제 기능 연결 예정");
                setShowModal(false);
            }}
            />
        )}
      </div>

      <div className="w-full border-b border-[#999999] mb-2" />

      {/* 본문 + 답글버튼 */}
      <div className="flex items-start gap-2 ml-2 mb-2" style={{ alignItems: "center" }}>
        {showReplyButton && (
          <button
            onClick={onReplyClick}
            style={{
              backgroundColor: "#FFAC33",
              fontSize: "12px",
              fontWeight: fonts.weight.regular,
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              width: "46px",
              height: "27px",
              flexShrink: 0,
            }}
          >
            답글
          </button>
        )}
        <p className="text-sm break-words w-full" style={{ fontSize: "13px" }}>
          {content}
        </p>
      </div>

      {children}
    </div>
  );
};

export default CommentItem;
