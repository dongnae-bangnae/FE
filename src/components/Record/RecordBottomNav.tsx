import LikeIcon from "../../assets/icon-like.svg";
import BanIcon from "../../assets/icon-ban.svg";
import CommentIcon from "../../assets/icon-comment.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fonts from "../../styles/fonts";
import { useLikeArticle } from "../../hooks/mutations/useLikeArticle";
// import { LikeResponse } from "../../types/article";
import { useReportSpam } from "../../hooks/mutations/useReportSpam";

interface Props {
  articleId: number,
  likes: number;
  ban: number;
  comments: number;
  // active?: "comment"; 
}

const RecordBottomNav = ({articleId, likes, comments}: Props) => { 
  const navigate = useNavigate();

  const { mutate: like } = useLikeArticle(articleId);
  const { mutate: reportSpam } = useReportSpam(articleId);

  const [likeCount, setLikeCount] = useState(likes);

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
  }

  const [banCount, setBanCount] = useState(0);
  const handleBan = () => {
    const confirmed = window.confirm("해당 게시글을 광고로 신고하시겠습니까?");
    if (!confirmed) return;

    reportSpam(undefined, {
      onSuccess: () => {
        alert("신고가 접수되었습니다.");
        setBanCount((prev) => prev + 1);
      },
      onError: () => {
        alert("신고 접수에 실패했습니다.");
      }
    });
  };


  return (
    <div
      className="fixed bottom-[0] left-1/2 -translate-x-1/2 z-50 w-[375px] h-[60px] flex items-center justify-end px-[15px] gap-[10px] border-t border-neutral-400"
      style={{fontFamily: fonts.family, fontSize: "30px", fontWeight: fonts.weight.regular}}
      >
      <div className="flex items-center">
        <button onClick={handleLike} className="flex gap-[15px]">
          <img src={LikeIcon} width={30} height={30} />
          <span>{likeCount}</span> 
        </button>
      </div>

      <div className="flex items-center gap-[15px]">
        <button onClick={handleBan} className="flex gap-[15px]">
          <img src={BanIcon} width={23} height={23} />
          <span>{banCount}</span> 
        </button>
      </div>
      <div className="relative flex items-center gap-[15px]">
        <button onClick={()=>navigate(`/record/${articleId}/comments`,{ state: { articleId: 3} })} className="flex gap-[15px]">
          <img src={CommentIcon} width={23} height={23} /> 
          {/* articleId임시지정 */}
          <span>{comments}</span>
        </button>
      </div>
    </div>
  );
};

export default RecordBottomNav;







