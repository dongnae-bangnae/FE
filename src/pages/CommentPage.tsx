import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import CheckIcon_g from "../assets/icon-check-green.svg";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { useCreateComment } from "../hooks/mutations/useCreateComment";
import CommentItem from "../components/Record/CommentItem";
import { useMyInfo } from "../hooks/queries/useMyInfo";
import MessagePopup from "../components/MessagaePopup";

interface LocationState {
  articleId: number;
}

interface CommentData {
  id: number;
  content: string;
  nickname: string;
  profileImage: string;
  parentCommentId: number | null;
}

function CommentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const articleId = (state as LocationState)?.articleId ?? 1;

  const [newComment, setNewComment] = useState("");
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const { mutate: createComment } = useCreateComment(articleId);
  const { data: myInfo } = useMyInfo();

  const handleSubmitComment = (content: string, parentCommentId: number | null) => {
    if (!content.trim() || !myInfo) return;

    createComment(
      {
        content,
        parentCommentId,
      },
      {
        onSuccess: (res) => {
          const newCommentObj: CommentData = {
            id: res.result.commentId,
            content,
            nickname: myInfo.nickname,
            profileImage: myInfo.profileImage,
            parentCommentId,
          };

          setComments((prev) => [...prev, newCommentObj]);

          if (parentCommentId === null) {
            setNewComment("");
          } else {
            setReplyMap((prev) => ({ ...prev, [parentCommentId]: "" }));
            setActiveReplyId(null);
          }

          setShowPopup(true);
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
        <button onClick={() => navigate(-1)} 
              style={{ all: "unset", cursor: "pointer" }}>
          <img src={BackIcon} alt="back" width={30} height={28} />
        </button>
        <div style={{ fontSize: fonts.size.subtitle, fontWeight: fonts.weight.bold }}>
          글 댓글
        </div>
        <div style={{ width: "30px" }} />
      </div>

      {/* 댓글 목록 */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4">
        {comments
          .filter((comment) => comment.parentCommentId === null)
          .map((parentComment) => (
            <div key={parentComment.id}>
              <CommentItem
                nickname={parentComment.nickname}
                content={parentComment.content}
                profileImage={parentComment.profileImage}
                isMine={myInfo?.nickname === parentComment.nickname}
                onReplyClick={() =>
                  setActiveReplyId((prev) => (prev === parentComment.id ? null : parentComment.id))
                }
              />

              {/* 답글 입력창 */}
              {activeReplyId === parentComment.id && (
                <CommentItem
                  nickname={myInfo?.nickname || ""}
                  content=""
                  isReply
                  showReplyButton={false}
                  profileImage={myInfo?.profileImage}
                >
                  <div className="flex items-center gap-2 ml-2 mb-2" style={{ alignItems: "center" }}>
                    <button
                      onClick={() =>
                        handleSubmitComment(replyMap[parentComment.id] || "", parentComment.id)
                      }
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
                    <textarea
                      value={replyMap[parentComment.id] || ""}
                      placeholder="답글을 입력하세요"
                      style={{
                        fontSize: "13px",
                        resize: "none",
                        height: "35px",
                        width: "100%",
                        marginRight: "10px",
                        border: "1px solid #888888",
                        borderRadius: "10px",
                        padding: "5px 8px",
                      }}
                      onChange={(e) =>
                        setReplyMap((prev) => ({
                          ...prev,
                          [parentComment.id]: e.target.value,
                        }))
                      }
                      // ...
                    />
                  </div>
                </CommentItem>
              )}

              {/* 답글 */}
              {comments
                .filter((c) => c.parentCommentId === parentComment.id)
                .map((childComment) => (
                  <div key={childComment.id}>
                    <CommentItem
                      nickname={childComment.nickname}
                      content={childComment.content}
                      isReply
                      profileImage={childComment.profileImage}
                      isMine={myInfo?.nickname === childComment.nickname}
                    />
                  </div>
                ))}
            </div>
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
            style={{ borderColor: "#B3B3B3" }}
          />
          <button
            onClick={() => handleSubmitComment(newComment, null)}
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFAC33")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = colors.gray200)
            }
          >
            등록
          </button>
        </div>
      </div>

      {showPopup && (
        <MessagePopup 
          icon={CheckIcon_g}
          message="댓글이 등록되었어요"/>
      )}
    </div>
  );
}

export default CommentPage;
