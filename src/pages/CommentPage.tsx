import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { commentNotifications } from "../../src/dummyData/notificationData";
import DefaultProfileIcon from "../assets/icon-defaultProfile.svg";
import { useCreateComment } from "../hooks/mutations/useCreateComment";

interface LocationState {
  articleId: number;
}
function CommentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const articleId = (state as LocationState)?.articleId ?? 1; //임시지정

  const [newComment, setNewComment] = useState("");
  const { mutate: createComment } = useCreateComment(articleId);

  const handleNewCommentSubmit = () => {
    if (!newComment.trim()) return;

    createComment(
      {
        content: newComment,
        parentCommentId: 0,
      },
      {
        onSuccess: () => {
          alert("댓글이 등록되었습니다.");
          setNewComment("");
        },
        onError: () => {
          alert("댓글 등록에 실패했습니다.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: fonts.family }}>
      {/* 상단바 */}
      <div
        className="w-full flex items-center justify-between border-b border-[#999999]"
        style={{ padding: "14px 20px", gap: "10px", height: "56px" }}
      >
        <button onClick={() => navigate(-1)} style={{ all: "unset", cursor: "pointer" }}>
          <img src={BackIcon} alt="back" width={30} height={28} />
        </button>
        <div
          style={{
            fontSize: fonts.size.subtitle,
            fontWeight: fonts.weight.bold,
          }}
        >
          글 댓글
        </div>
        <div style={{ width: "30px" }} />
      </div>

      {/* 댓글 목록 */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4">
        {commentNotifications.map((comment) => (
          comment.type === "comment" && (
            <div
              key={comment.id}
              className="border rounded-xl w-full max-w-[355px]"
              style={{ border: "1px solid rgba(0, 0, 0, 0.47)" }}
            >
              {/* 프로필 & 닉네임 */}
              <div className="flex items-center gap-2 mb-2 ml-2 mt-2">
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
                  @{comment.nickname}
                </span>
              </div>

              <div className="w-full border-b border-[#999999] mb-2" />

              <div className="flex items-start gap-2 ml-2 mb-2">
                <button
                  onClick={() => alert(`댓글 ${comment.id}에 답글`)}
                  style={{
                    backgroundColor: colors.primaryDark,
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
                <p className="text-sm break-words w-full" style={{ fontSize: "13px" }}>
                  {comment.subText}
                </p>
              </div>
            </div>
          )
        ))}
      </div>

      {/* 새 댓글 입력창 */}
      <div className="w-full px-4 py-3 mb-[15px]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 p-2 text-sm border w-[270px] h-[48px] m-[10px] rounded-sm"
            style={{ borderColor:  "#B3B3B3"}}
          />
          <button
            onClick={handleNewCommentSubmit}
            style={{
              padding: "6px 12px",
              backgroundColor: colors.gray200,
              fontSize: fonts.size.caption,
              fontWeight: fonts.weight.medium,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              width: "65px",
              height: "39px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFAC33")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.gray200)}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentPage;

