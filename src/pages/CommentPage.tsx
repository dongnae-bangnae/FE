import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import UpperIcon from "../assets/record/icon-upper.svg";
import CheckIcon_g from "../assets/icon-check-green.svg";
import DefaultProfileIcon from "../assets/icon-defaultProfile.svg";
import fonts from "../styles/fonts";
import colors from "../styles/colors";
import { useCreateComment } from "../hooks/mutations/useCreateComment";
import CommentItem from "../components/Record/CommentItem";
import { useMyInfo } from "../hooks/queries/useMyInfo";
import MessagePopup from "../components/MessagePopup";
import { useUpdateComment } from "../hooks/mutations/useUpdateComment";
import { useDeleteComment } from "../hooks/mutations/useDeleteComment";
import SpamPopup from "../components/Record/SpamPopup";
import CommentSpamModal from "../components/Record/CommentSpamModal";
import { useFetchComments } from "../hooks/queries/useFetchComments";

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
  const queryClient = useQueryClient();
  const articleId = (state as LocationState)?.articleId ?? 1;
  const deleteCommentMutation = useDeleteComment();

  const [newComment, setNewComment] = useState("");
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showSubmit, setShowSubmit] = useState(false);
  const [showSpamPopup, setShowSpamPopup] = useState(false);
  const [replyTarget, setReplyTarget] = useState<{id: number; nickname: string;} | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);

  const { mutate: createComment } = useCreateComment(articleId);
  const { data: myInfo } = useMyInfo();
  const { data: fetched, isLoading, isError } = useFetchComments(articleId);
  useEffect(() => {
    const list = (fetched?.result ?? fetched) as any[];
    if (!Array.isArray(list)) return;
    const normalized: CommentData[] = list.map((c: any) => ({
      id: c.commentId ?? c.id,
      content: c.content ?? "",
      nickname: c.nickname ?? c.writerNickname ?? "",
      profileImage: c.profileImage ?? c.writerProfileImage ?? "",
      parentCommentId: c.parentCommentId ?? null,
    }));
    setComments(normalized);
  }, [fetched]);

  const { mutate: updateComment } = useUpdateComment(
    articleId,
    editCommentId ?? -1
  );

  const handleSubmitComment = (
    content: string,
    parentCommentId: number | null
  ) => {
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
          queryClient.invalidateQueries({ queryKey: ["comments", articleId]});

          if (parentCommentId === null) {
            setNewComment("");
          } else {
            setReplyMap((prev) => ({ ...prev, [parentCommentId]: "" }));
            setActiveReplyId(null);
          }

          setNewComment("");
          setReplyTarget(null);
          setShowPopup(true);
        },
        onError: () => {
          alert("댓글 등록에 실패했습니다.");
        },
      }
    );
  };

  const handleEditComment = (id: number, content: string) => {
    alert("수정 기능 연결 예정")
  };

  // const handleUpdateComment = () => {
  //   if (!editedContent.trim() || editCommentId === null) return;

  //   updateComment(editedContent, {
  //     onSuccess: () => {
  //       setComments((prev) =>
  //         prev.map((c) =>
  //           c.id === editCommentId ? { ...c, content: editedContent } : c
  //         )
  //       );
  //       setEditCommentId(null);
  //       setEditedContent("");
  //     },
  //     onError: () => alert("댓글 수정 실패"),
  //   });
  // };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(
      { articleId, commentId },
      {
        onSuccess: () => {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
          queryClient.invalidateQueries({ queryKey: ["comments", articleId]});
          alert("정말 댓글을 삭제하시겠습니까?");
        },
        onError: () => alert("댓글 삭제 실패"),
      }
    );
  };


  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: fonts.family }}>
      {/* 상단바 */}
      <div
        className="w-full flex items-center justify-between"
        style={{ padding: "14px 20px", gap: "10px", height: "56px" }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ all: "unset", cursor: "pointer" }}
        >
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
      {isLoading && <div className="px-4 py-2">댓글 불러오는 중...</div>}
      {isError && <div className="px-4 py-2">댓글 불러오기에 실패했습니다</div>}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-4">
        {comments
          .filter((comment) => comment.parentCommentId === null)
          .map((parentComment) => (
            <div key={parentComment.id}>
              <CommentItem
                nickname={parentComment.nickname}
                content={
                  editCommentId === parentComment.id
                    ? editedContent
                    : parentComment.content
                }
                profileImage={parentComment.profileImage}
                isMine={myInfo?.nickname === parentComment.nickname}
    
                onEdit={() =>
                  handleEditComment(parentComment.id, parentComment.content)
                }
                onDelete={() => handleDeleteComment(parentComment.id)}

                onReplyClick={() => {
                  setReplyTarget({ id: parentComment.id, nickname: parentComment.nickname });
                  setNewComment((prev) => {
                    const mention = `${parentComment.nickname}`;
                    return prev.startsWith(mention) ? prev : (prev ? `${mention}${prev}` : mention);
                  });
                }}
              >
                {/* {editCommentId === parentComment.id && (
                  <div className="flex items-center gap-2 ml-2 mb-2">
                    <button
                      onClick={handleUpdateComment}
                      style={{
                        backgroundColor: "#FFAC33",
                        fontSize: "12px",
                        fontWeight: fonts.weight.regular,
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        width: "60px",
                        height: "27px",
                        flexShrink: 0,
                      }}
                    >
                      수정완료
                    </button>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
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
                    />
                  </div>
                )} */}
              </CommentItem>

              {/* 답글 입력창 */}
              {activeReplyId === parentComment.id && (
                <CommentItem
                  nickname={myInfo?.nickname || ""}
                  content=""
                  isReply
                  showReplyButton={false}
                  profileImage={myInfo?.profileImage}
                >
                  <div
                    className="flex items-center gap-2 ml-2 mb-2"
                    style={{ alignItems: "center" }}
                  >
                    <button
                      onClick={() =>
                        handleSubmitComment(
                          replyMap[parentComment.id] || "",
                          parentComment.id
                        )
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
                    />
                  </div>
                </CommentItem>
              )}

              {/* 답글 */}
              {comments
                .filter((c) => c.parentCommentId === parentComment.id)
                .map((childComment) => (
                  <div key={childComment.id} className="bg-[#FFF5E7]">
                    <CommentItem
                      nickname={childComment.nickname}
                      content={childComment.content}
                      isReply
                      profileImage={childComment.profileImage}
                      isMine={myInfo?.nickname === childComment.nickname}
                      onEdit={() => handleEditComment(childComment.id, childComment.content)}
                      onDelete={() => handleDeleteComment(childComment.id)}
                    />
                  </div>
                ))}
            </div>
          ))}
      </div>

      {/* 새 댓글 입력창 */}
      <div className="w-full px-5 py-1 mb-[15px]">
        <div className="flex items-center gap-3">
        {/* 답글 작성 시 */}
        {replyTarget && (
            <div
             className="absolute left-1/2 -translate-x-1/2 -translate-y-[42px] z-10
                         flex items-center gap-2 px-3 py-2 rounded-xl shadow"
              style={{ background: "#fff" }}
            >
              <span className="text-sm">
                <b>{replyTarget.nickname}</b>님에게 답글을 남기는 중…
              </span>
              <button
                onClick={() => setReplyTarget(null)}
                className="text-gray-500"
                aria-label="답글 취소"
              >
                ×
              </button>
            </div>
          )}
          {/* 프로필사진 */}
          <div className="rounded-full w-[47px] h-[47px] overflow-hidden flex-shrink-0">
            <img
              src={myInfo?.profileImage && myInfo.profileImage.trim() !== "" 
                ? myInfo.profileImage 
                : DefaultProfileIcon}
              alt="프로필"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="relative flex-1 h-[47px]">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyTarget ? `${replyTarget.nickname}` : "여러분의 동네 이야기도 궁금해요 💭"
              }
              className="w-full h-full px-4 text-sm border rounded-full" 
              style={{borderColor: "#B3B3B3"}}
            />

            {newComment.trim().length > 0 && (
              <button
                onMouseDown={(e) => e.preventDefault()} 
                onClick={() => handleSubmitComment(newComment, replyTarget ? replyTarget.id : null)}
                className="absolute right-3 inset-y-0 my-auto flex items-center justify-center rounded-[12px] w-[40px] h-[27px]"
                style={{
                  backgroundColor: colors.primaryDark,
                }}
              >
                <img src={UpperIcon} className="block w-[20px] h-[16px]"/>
              </button>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <MessagePopup icon={CheckIcon_g} message="댓글이 등록되었어요" />
      )}

      {/* api 연동 후 팝업 */}
      
      {/*<SpamModal 
        title="신고사유를 알려주세요" 
        cancelText="취소"
        confirmText="신고"
        onCancel={() => {
          //항상(임시)
        }}
        onConfirm={(reason, etc) => {
          console.log("선택: ", reason, "기타: ", etc);
        }}
      /> */}

      {/* <CommentSpamModal
        onClose={() => {}}
        onReport={() => setShowSpamPopup(true)}
      />

      {showSpamPopup && (
        <SpamPopup
          title="신고사유를 알려주세요"
          confirmText="신고"
          cancelText="취소"
          onCancel={() => setShowSpamPopup(false)}
          onConfirm={(reason, etc) => {
            // TODO: 신고 API 호출
            // reason: "AD" | "PRIVACY" | "ABUSE" | "ETC"
            // etc: 기타 사유 텍스트(ETC일 때)
            setShowSpamPopup(false);
          }}
        />
      )} */}
    </div>
  );
}

export default CommentPage;
