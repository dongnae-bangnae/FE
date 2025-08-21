import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
import { useArticleViewStore } from "../stores/articleView";

interface LocationState {
  articleId: number;
}

interface CommentData {
  id: number;
  content: string;
  nickname?: string;
  profileImage?: string;
  parentCommentId: number | null;
  memberId?: number;
  isMine?: boolean;
}

const toNum = (v: any): number | null => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const firstNonEmpty = (...cands: (string | undefined)[]) => {
  for (const c of cands) {
    if (typeof c === "string" && c.trim() !== "") return c;
  }
  return undefined;
};

type ReplyTarget = { id: number; nickname: string; parentId: number | null };

// 작성자 정보 저장
type AuthorInfo = { nickname?: string; profileImage?: string };
const cacheKey = (articleId: number) => `comment-author-cache:v1:article:${articleId}`;
const loadCache = (articleId: number): Map<number, AuthorInfo> => {
  try {
    const raw = sessionStorage.getItem(cacheKey(articleId));
    if (!raw) return new Map();
    const obj = JSON.parse(raw) as Record<string, AuthorInfo>;
    return new Map<number, AuthorInfo>(Object.entries(obj).map(([k, v]) => [Number(k), v]));
  } catch {
    return new Map();
  }
};
const saveCache = (articleId: number, map: Map<number, AuthorInfo>) => {
  const obj: Record<number, AuthorInfo> = {};
  map.forEach((v, k) => (obj[k] = v));
  try {
    sessionStorage.setItem(cacheKey(articleId), JSON.stringify(obj));
  } catch {
    /* ignore quota errors */
  }
};

function CommentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryClient = useQueryClient();

  const { id: idParam, articleId: articleIdParam } = useParams<{ id?: string; articleId?: string }>();
  const idFromUrl = (idParam ?? articleIdParam) && /^\d+$/.test((idParam ?? articleIdParam)!)
    ? Number(idParam ?? articleIdParam)
    : 0;

  const idFromState = (state as LocationState)?.articleId || 0;

  const storeArticleId = useArticleViewStore((s) => s.articleId) || 0;

  // 최종
  const articleId = idFromUrl || idFromState || storeArticleId;

  const deleteCommentMutation = useDeleteComment();

  const [newComment, setNewComment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showSpamPopup, setShowSpamPopup] = useState(false);
   const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);

  const { mutate: createComment } = useCreateComment(articleId);
  const { data: myInfo } = useMyInfo();
  const { data: fetchedComments = [], isLoading, isError } = useFetchComments(articleId, { enabled: articleId > 0});
  
  const authorCacheRef = useRef<Map<number, AuthorInfo>>(new Map());
  const cacheReadyRef = useRef(false);
  useEffect(() => {
    // 기사 변경 시 캐시 로드
    authorCacheRef.current = loadCache(articleId);
    cacheReadyRef.current = true;
  }, [articleId]);
  
  useEffect(() => {
    if (!cacheReadyRef.current) return;

    setComments((prev) => {
      const prevMap = new Map(prev.map(p => [p.id, p]));    
      const cache = authorCacheRef.current;
      
      const normalized = (fetchedComments as any[]).map((c) => {
        const id = toNum(c.id ?? c.commentId ?? c.comment_id)!;        
        const memberId = toNum(c.memberId ?? c.writerId ?? c.userId);
        const parentId = toNum(c.parentCommentId ?? c.parent_id);

        const prevItem = prevMap.get(id);    
        const cached = cache.get(id);                         
        const isMineServer = typeof c.isMine === "boolean" ? c.isMine : undefined;                                               

        const nickname =
          firstNonEmpty(
            prevItem?.nickname,
            c.nickname,
            c.memberNickname,
            c.writerNickname,
            cached?.nickname,
            c.userNickname,
            (isMineServer || (myInfo?.memberId != null && memberId != null && memberId === myInfo.memberId))
              ? myInfo?.nickname
              : undefined,
            "익명"
          ) || "익명"; // 안전장치

        const profileImage =
          firstNonEmpty(
            prevItem?.profileImage,
            c.profileImage,
            c.memberProfileImage,
            c.writerProfileImage,
            c.userProfileImage,
            cached?.profileImage,
            (isMineServer || (myInfo?.memberId != null && memberId != null && memberId === myInfo.memberId))
              ? myInfo?.profileImage
              : undefined,
            "" 
          ) || "";

           if (nickname && nickname !== "익명") {
            const e = cache.get(id) ?? {};
            if (!e.nickname || e.nickname !== nickname) e.nickname = nickname;
            cache.set(id, e);
          }
          if (profileImage && profileImage.trim() !== "") {
            const e = cache.get(id) ?? {};
            if (!e.profileImage || e.profileImage !== profileImage) e.profileImage = profileImage;
            cache.set(id, e);
          }

        return {
          id,
          content: c.content ?? "",
          nickname,
          profileImage,
          parentCommentId: parentId ?? null,
          memberId: memberId ?? undefined,
          isMine: isMineServer,
        } as CommentData;
      });

      saveCache(articleId, cache);

      const incomingIds = new Set(normalized.map(n => n.id));          
      const keepLocal = prev.filter(p => !incomingIds.has(p.id));     
      return [...normalized, ...keepLocal];                         
    });
  }, [fetchedComments, myInfo]); 

  const { mutate: updateComment } = useUpdateComment(
    articleId,
    editCommentId ?? -1
  );

  const isMine = (c: CommentData) => {
    if (typeof c.isMine === "boolean") return c.isMine;
    if (myInfo?.memberId != null && c.memberId != null) return myInfo.memberId === c.memberId;
    if (myInfo?.nickname && c.nickname) return myInfo.nickname === c.nickname;
    return false;
  };

  const handleSubmitComment = (
    content: string,
    parentCommentId: number | null
  ) => {
    if (!content.trim() || !myInfo) return;

    //수정
    if (editCommentId !== null) {
      updateComment(content, {
        onSuccess: () => {
          setComments((prev) =>
            prev.map((c) => (c.id === editCommentId ? { ...c, content } : c))
          );
          setEditCommentId(null);
          setNewComment("");
          queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
          setShowPopup(true);
        },
        onError: () => alert("댓글 수정 실패"),
      });
      return;
    }

    const optimisticId = Date.now();
    const optimistic: CommentData = {
      id: optimisticId,
      content,
      nickname: myInfo.nickname,
      profileImage: myInfo.profileImage,
      parentCommentId,
      memberId: myInfo.memberId,
      isMine: true,
    };
    setComments((prev) => [...prev, optimistic]);  

    const cache = authorCacheRef.current;
    cache.set(optimisticId, { nickname: myInfo.nickname, profileImage: myInfo.profileImage });
    saveCache(articleId, cache);

    createComment(
      {
        content,
        parentCommentId,
      },
      {
        onSuccess: (res) => {
          const realId = toNum(res?.result?.commentId) ?? optimisticId;
          setComments((prev) =>
            prev.map((c) => (c.id === optimistic.id ? { ...c, id: realId } : c))
          );
          const info = cache.get(optimisticId);
          if (info) {
            cache.delete(optimisticId);
            cache.set(realId, info);
            saveCache(articleId, cache);
          }

          queryClient.invalidateQueries({ queryKey: ["comments", articleId] });

          setNewComment("");
          setReplyTarget(null);
          setShowPopup(true);
        },
        onError: () => {
          setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
          //캐시롤백
          const cache2 = authorCacheRef.current;
          cache2.delete(optimisticId);
          saveCache(articleId, cache2);
          alert("댓글 등록에 실패했습니다.");
        },
      }
    );
  };

  const handleEditComment = (id: number, content: string) => {
    setEditCommentId(id);
    setNewComment(content);
  };

  const handleDeleteComment = (commentId: number) => {
    if (!confirm("정말 댓글을 삭제하시겠습니까?")) return;

    deleteCommentMutation.mutate(
      { articleId, commentId },
      {
        onSuccess: () => {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
          
          //캐시에서도 제거
          const cache = authorCacheRef.current;
          cache.delete(commentId);
          saveCache(articleId, cache);

          queryClient.invalidateQueries({ queryKey: ["comments", articleId]});
          <MessagePopup icon={CheckIcon_g} message="댓글이 삭제되었어요" />
        },
        onError: () => alert("댓글 삭제 실패"),
      }
    );
  };

  const activeBg = "bg-[#F3FBFF]";
  const isLikelyImageUrl = (s?: string) =>
  !!s && /^(https?:\/\/|data:image\/)/i.test(s);

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
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        {comments
          .filter((comment) => comment.parentCommentId === null)
          .sort((a, b) => a.id - b.id)
          .map((parentComment) => {
            const children = comments.filter((c) => c.parentCommentId === parentComment.id)
                                     .sort((a, b) => a.id - b.id);  
            const isParentActive = replyTarget?.id === parentComment.id;
            return (
              <div key={parentComment.id}>
                {/* 부모댓글에 답글 달 때 배경 변화 */}
                <div className={`${isParentActive ? activeBg : ""} -mx-4 px-4`}>
                  <CommentItem
                  nickname={parentComment.nickname ?? "익명"}          
                  content={parentComment.content}
                  profileImage={isLikelyImageUrl(parentComment.profileImage) ? parentComment.profileImage! : ""}       
                  isMine={isMine(parentComment)}                      
                  onEdit={() => handleEditComment(parentComment.id, parentComment.content)}
                  onDelete={() => handleDeleteComment(parentComment.id)}
                  onReplyClick={() => {
                    setEditCommentId(null);
                    setReplyTarget({ id: parentComment.id, nickname: parentComment.nickname ?? "익명", parentId: parentComment.id });
                    setNewComment("");
                  }}
                />
                </div>

                {/* 답글 */}
                {children.length > 0 && (
                  <div className="-mx-4">
                    {children.map((childComment) => {
                      const isChildActive = replyTarget?.id === childComment.id;
                      return (
                        <div
                          key={childComment.id}
                          className={`${isChildActive ? activeBg : "bg-[#FFF5E7]"} px-4`}
                        >
                          <CommentItem
                            nickname={childComment.nickname ?? "익명"}
                            content={childComment.content}
                            isReply
                            profileImage={isLikelyImageUrl(childComment.profileImage) ? childComment.profileImage! : ""}
                            isMine={isMine(childComment)}
                            onEdit={() => handleEditComment(childComment.id, childComment.content)}
                            onDelete={() => handleDeleteComment(childComment.id)}
                            onReplyClick={() => {
                              setEditCommentId(null);
                              setReplyTarget({
                                id: childComment.id, 
                                nickname: childComment.nickname ?? "익명",
                                parentId: parentComment.id,
                              });
                              setNewComment("");
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* 새 댓글 입력창 */}
      <div className="w-full px-5 py-1 mb-[15px]">
        <div className="flex items-center gap-3">
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
            {/* 편집중 */}
            {editCommentId !== null && (
              <div className="absolute -top-[42px] left-0 right-0 z-10
                              flex items-center justify-between px-3 py-2
                              rounded-xl shadow bg-[#F5F5F5]">
                <span style={{fontWeight: fonts.weight.regular, font: fonts.size.caption}}>
                  <b>댓글을 수정하는 중…</b>
                </span>
                <button
                  onClick={() => { setEditCommentId(null); setNewComment(""); }}
                  className="ml-2 text-gray-500"
                  aria-label="수정 취소"
                >
                  ×
                </button>
              </div>
            )}

            {/* 답글 등록 시 */}
            {editCommentId === null && replyTarget && (
              <div className="absolute -top-[42px] left-0 right-0 z-10
                              flex items-center justify-between px-3 py-2
                              rounded-xl shadow bg-[#F5F5F5]">
                <span className="text-sm truncate">
                  <b><span style={{color: colors.primaryDark}}>{replyTarget.nickname}</span></b>
                  <span className="ml-1">님에게 답글을 남기는 중…</span>
                </span>
                <button
                  onClick={() => setReplyTarget(null)}
                  className="ml-2 text-gray-500"
                  aria-label="답글 취소"
                >
                  ×
                </button>
              </div>
            )}

            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                editCommentId !== null
                  ? "" 
                  : replyTarget
                  ? `@${replyTarget.nickname}님에게 답글을 남기는 중... `
                  : "여러분의 동네 이야기도 궁금해요 💭"
              }
              className="w-full h-full px-4 text-sm border rounded-full"
              style={{borderColor: "#B3B3B3"}}
            />

            {newComment.trim().length > 0 && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  handleSubmitComment(
                    newComment,
                    replyTarget ? (replyTarget.parentId ?? replyTarget.id) : null
                  )
                }
                className="absolute right-3 inset-y-0 my-auto flex items-center justify-center rounded-[12px] w-[40px] h-[27px]"
                style={{ backgroundColor: colors.primaryDark }}
              >
                <img src={UpperIcon} className="block w-[20px] h-[16px]" />
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