import MenuBarIcon from "../../assets/record/icon-menubar.svg";
import DefaultProfileIcon from "../../assets/icon-defaultProfile.svg";
import fonts from "../../styles/fonts";
import { useState } from "react";
import CommentEditModal from "./CommentEditModal"

interface CommentItemProps {
  nickname: string;
  content: string;
  showReplyButton?: boolean;
  onReplyClick?: () => void;
  children?: React.ReactNode;
  isReply?: boolean;
  isMine?: boolean;
  profileImage?: string,
  onEdit?: () =>  void;
  onDelete?: () => void;
}

const CommentItem = ({
  nickname,
  content,
  showReplyButton = true,
  onReplyClick,
  children,
  isReply = false,
  isMine = true, //임시
  onEdit,
  onDelete
}: CommentItemProps) => {
   
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="w-full max-w-[355px]"
      style={{
        marginTop: isReply ? "10px" : 0,
      }}
    >
      {/* 프로필 + 닉네임 */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-2 ml-2 mt-2">
          {isReply && (
            <div className="ml-[20px]" />
          )}
          <img
            src={DefaultProfileIcon}
            alt="avatar"
            className="w-[25px] h-[25px] rounded-full"
          />
          <span
            style={{
              fontSize: fonts.size.body,
              fontWeight: fonts.weight.medium,
            }}
          >
            @{nickname}
            {/* 임시값 */}
          </span>
        </div>

        {/* 모달 렌더링 */}
        {isMine && (
          <>
            <button className="mr-[12px]" onClick={() => setShowModal(true)}>
              <img src={MenuBarIcon} />
            </button>
            {showModal && (
              <CommentEditModal
                onClose={() => setShowModal(false)}
                onEdit={() => {
                  onEdit?.();
                  setShowModal(false);
                }}
                onDelete={() => {
                  onDelete?.();
                  setShowModal(false);
                }}
              />
            )}
          </>
        )}


      </div>

      <div className="w-full border-b border-[#999999] mb-2" />

      {/* 본문 + 답글버튼 */}
      <div className="flex items-start gap-2 ml-2 mb-2" style={{ alignItems: "center" }}>
        {showReplyButton && (
          <button
            onClick={onReplyClick}
            style={{
              fontSize: "15px",
              fontWeight: fonts.weight.regular,
              border: "none",
              cursor: "pointer",
              width: "26px",
              height: "18px",
              flexShrink: 0,
              color: "#68707B",
            }}
          >
            답글
          </button>
        )}
        <p className="break-words w-full" style={{ fontSize: "15px" }}>
          {content}
        </p>
      </div>

      {children}
    </div>
  );
};

export default CommentItem;
