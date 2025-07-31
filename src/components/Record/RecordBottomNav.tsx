import LikeIcon from "../../assets/icon-like.svg";
import SpamIcon from "../../assets/icon-ban.svg"; // ← Ban → Spam
import CommentIcon from "../../assets/icon-comment.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fonts from "../../styles/fonts";

import { useToggleLikeArticle } from "../../hooks/mutations/useToggleLikeArticle";
import { useToggleSpamReport } from "../../hooks/mutations/useToggleSpamReport";

interface Props {
  articleId: number;
  likes: number;
  spam: number; 
  comments: number;
}

const RecordBottomNav = ({ articleId, likes, spam, comments }: Props) => {
  const navigate = useNavigate();

  const { mutate: toggleSpam } = useToggleSpamReport(articleId);
  const { mutate: toggleLike } = useToggleLikeArticle(articleId);

  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  const [spamCount, setSpamCount] = useState<number>(spam); 
  const [isReported, setIsReported] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLike = () => {
    if (liked) {
      const confirmCancel = window.confirm("좋아요를 취소하시겠습니까?");
      if (!confirmCancel) return;
    }

    toggleLike(liked, {
      onSuccess: () => {
        setLiked((prev) => !prev);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      },
      onError: () => {
        alert("좋아요 처리 중 오류가 발생했습니다.");
      },
    });
  };

  const handleSpam = () => {
    const next = !isReported;

    toggleSpam(next, {
      onSuccess: () => {
        setIsReported(next);
        setSpamCount((prev) => next ? prev + 1 : Math.max(prev - 1, 0));
      },
      onError: () => {
        alert("신고 처리 중 오류가 발생했습니다.");
      },
    });
  };


  return (
    <div
      className="fixed bottom-[0] left-1/2 -translate-x-1/2 z-50 w-[375px] h-[60px] flex items-center justify-end px-[15px] gap-[10px] border-t border-neutral-400"
      style={{
        fontFamily: fonts.family,
        fontSize: "30px",
        fontWeight: fonts.weight.regular,
      }}
    >
      {/* 좋아요 */}
      <div className="flex items-center">
        <button onClick={handleLike} className="flex gap-[15px]">
          <img src={LikeIcon} width={30} height={30} />
          <span>{likeCount}</span>
        </button>
      </div>

      {/* 광고 신고 */}
      <div className="flex items-center gap-[15px]">
        <button onClick={handleSpam} className="flex gap-[15px]">
          <img src={SpamIcon} width={23} height={23} />
          <span>{spamCount}</span>
        </button>
      </div>

      {/* 댓글 */}
      <div className="relative flex items-center gap-[15px]">
        <button
          onClick={() =>
            navigate(`/record/${articleId}/comments`, { state: { articleId } })
          }
          className="flex gap-[15px]"
        >
          <img src={CommentIcon} width={23} height={23} />
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default RecordBottomNav;






