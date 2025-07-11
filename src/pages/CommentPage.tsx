import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { commentNotifications } from "../../src/dummyData/notificationData";
import DefaultProfileIcon from "../assets/icon-defaultProfile.svg";

function CommentPage() {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const handleNewCommentSubmit = () => {
    if (newComment.trim()) {
      alert(`새 댓글 등록: ${newComment}`);
      setNewComment("");
    }
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
                style={{border: "1px solid rgba(0, 0, 0, 0.47)"}}
            >
                {/* 프로필 & 닉네임 */}
                <div className="flex items-center gap-2 mb-2" style={{marginLeft: "5px", marginBottom: "6px", marginTop:"6px"}}>
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

                {/* 구분선 */}
                <div className="w-full border-b border-[#999999] mb-2" />

                {/* 답글 버튼 + 댓글 내용 */}
                <div className="flex items-center gap-2" style={{marginLeft: "5px", marginBottom: "6px"}}>
                <button 
                    onClick={() => alert(`댓글 ${comment.id}에 답글`)}
                    style={{
                    backgroundColor: "#D9D9D9",
                    fontSize: "12px",
                    fontWeight: fonts.weight.regular,
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "46px",
                    height: "27px",
                    }}
                >
                    답글
                </button>
                <p className="text-sm" style={{ fontSize: "13px" }}>
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
            className="flex-1 p-2 text-sm border w-[270px] h-[48px]"
            style={{border: "1px solid rgba(0, 0, 0, 0.47"}}
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
              height: "39px"
            }}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentPage;
