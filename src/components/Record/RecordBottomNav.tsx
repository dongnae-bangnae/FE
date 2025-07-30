import LikeIcon from "../../assets/icon-like.svg";
import SpamIcon from "../../assets/icon-ban.svg"; // ← Ban → Spam
import CommentIcon from "../../assets/icon-comment.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fonts from "../../styles/fonts";
import { useLikeArticle } from "../../hooks/mutations/useLikeArticle";
import { useReportSpam } from "../../hooks/mutations/useReportSpam";

interface Props {
  articleId: number;
  likes: number;
  spam: number; // ← ban → spam
  comments: number;
  onShowConfirm?: () => void;
}

const RecordBottomNav = ({ articleId, likes, spam, comments, onShowConfirm }: Props) => {
  const navigate = useNavigate();

  const { mutate: like } = useLikeArticle(articleId);
  const { mutate: reportSpam } = useReportSpam();

  const [likeCount, setLikeCount] = useState(likes);
  const [spamCount, setSpamCount] = useState<number>(spam); // ← banCount → spamCount
  const [isReported, setIsReported] = useState(false);

  const handleLike = () => {
    like(undefined, {
      onSuccess: (res) => {
        alert("좋아요가 등록되었습니다");
        setLikeCount(res.likeCount);
      },
      onError: () => {
        alert("좋아요 등록 실패");
      },
    });
  };

  const handleSpam = () => {
    if (isReported) {
      // 이미 신고
      setIsReported(false);
      setSpamCount((prev: number) => Math.max(prev - 1, 0));
      alert("신고가 취소되었습니다.");
    } else {
      // 처음 신고
      reportSpam(articleId, {
        onSuccess: () => {
          setSpamCount((prev) => prev + 1);
          setIsReported(true);
          onShowConfirm?.(); // MyPageModal
        },
        onError: () => {
          alert("신고 접수에 실패했습니다.");
        },
      });
    }
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






