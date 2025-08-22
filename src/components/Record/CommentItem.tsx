import MenuBarIcon from "../../assets/record/icon-menubar.svg";
import DefaultProfileIcon from "../../assets/icon-defaultProfile.svg";
import { useState } from "react";
import CommentEditModal from "./EditModal"
import colors from "../../styles/colors";

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
  onReplyClick,
  children,
  isReply = false,
  isMine = false,
  profileImage,
  onEdit,
  onDelete
}: CommentItemProps) => {
   
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="w-full max-w-[355px]"
      style={{
        marginTop: 0,
      }}
    >
      {/* 프로필 + 닉네임 + 댓*/}
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-2 ml-2 mt-2">
          {isReply && (
            <div className="ml-[20px]" />
          )}
          <img
            src={profileImage && profileImage.trim() !== "" ? profileImage : DefaultProfileIcon}
            alt="avatar"
            className="w-[46px] h-[46px] rounded-full"
          />
          <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[14px]" style={{fontWeight: 600,}}>
                      {nickname}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, }}
                     className="break-words whitespace-pre-wrap"
                  >{content}</p>
                  <button
                    onClick={onReplyClick}
                    style={{
                      fontSize: 13,
                      color: colors.gray400,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    답글
                  </button>
                </div>
        </div>
        {/* 모달 렌더링 */}
        {isMine && (
          <>
            <button className="mr-[12px]" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}>
              <img src={MenuBarIcon} />
            </button>
            {showModal && (
              <div className="w-[375px]">
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
              </div>
            )}
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default CommentItem;