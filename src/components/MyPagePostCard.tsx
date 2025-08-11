import { useNavigate } from "react-router-dom";

import BanIcon from "../assets/icon-ban.svg";
import CommentIcon from "../assets/icon-comment.svg";
import LikeIcon from "../assets/icon-like.svg";
import pin_bookstore from "../assets/pin/pin_bookstore.svg";
import pin_cafe from "../assets/pin/pin_cafe.svg";
import pin_culture_art from "../assets/pin/pin_culture_art.svg";
import pin_etc from "../assets/pin/pin_etc.svg";
import pin_food from "../assets/pin/pin_food.svg";
import pin_pub from "../assets/pin/pin_pub.svg";
import pin_exercise from "../assets/pin/pin_sports.svg";
import pin_walk from "../assets/pin/pin_walk.svg";

interface MyPagePostCardProps {
  articleId?: number; // 게시글 ID
  category: string;
  imageUrl: string;
  title: string;
  likes: number;
  comments: number;
  spam: number;
  nickname?: string;
  userImage?: string | null;
}

// 영문 pinCategory → 한글 카테고리명 매핑
const categoryNameMap: Record<string, string> = {
  FOOD: "맛집",
  CAFE: "카페",
  PUB: "술집",
  WALK: "산책",
  EXERCISE: "운동",
  BOOKSTORE: "서점",
  CULTURE_ART: "문화 예술",
  ETC: "기타"
};

// 영문 pinCategory → 아이콘 이미지 매핑
const pinIcons: Record<string, string> = {
  FOOD: pin_food,
  CAFE: pin_cafe,
  PUB: pin_pub,
  WALK: pin_walk,
  EXERCISE: pin_exercise,
  BOOKSTORE: pin_bookstore,
  CULTURE_ART: pin_culture_art,
  ETC: pin_etc
};

export default function MyPagePostCard({
  articleId,
  category,
  imageUrl,
  title,
  likes,
  comments,
  spam
}: MyPagePostCardProps) {
  const navigate = useNavigate();
  const iconSrc = pinIcons[category] ?? pin_etc;
  const koreanCategory = categoryNameMap[category] ?? "기타";

  const goDetail = () => navigate(`/record/${articleId}`); // 게시물 상세 페이지로 이동

  return (
    <div className="w-[360px] box-border border border-[#D9D9D9] rounded-[10px] overflow-hidden bg-white">
      {/* 상단: 카테고리 */}
      <div className="h-[40px] px-[15px] border-b border-[#D9D9D9] flex items-center gap-2">
        <img src={iconSrc} alt="핀 아이콘" className="w-[18px] h-[18px]" />
        <span className="text-[14px] font-medium text-black">
          {koreanCategory}
        </span>
      </div>

      {/* 이미지 (클릭시 이동) */}
      <div
        role="button"
        onClick={goDetail}
        className="w-full h-[200px] bg-cover bg-center bg-no-repeat cursor-pointer"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundColor: "lightgray"
        }}
        aria-label={`${title} 상세보기`}
      />

      {/* 제목 (클릭시 이동) */}
      <div
        role="button"
        onClick={goDetail}
        className="h-[40px] px-[15px] py-[10px] text-sm flex items-center border-t border-[#D9D9D9] cursor-pointer"
        title={title}
      >
        {title}
      </div>

      {/* 하단: 피드백 아이콘들 */}
      <div className="h-[30px] px-[15px] text-xs text-black flex items-center justify-end gap-[10px] border-t border-[#D9D9D9] bg-white">
        <div className="flex items-center gap-[5px]">
          <img src={LikeIcon} alt="좋아요" className="w-[15px] h-[15px]" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-[5px]">
          <img src={CommentIcon} alt="댓글" className="w-[15px] h-[15px]" />
          <span>{comments}</span>
        </div>
        <div className="flex items-center gap-[5px]">
          <img src={BanIcon} alt="신고" className="w-[15px] h-[15px]" />
          <span>{spam}</span>
        </div>
      </div>
    </div>
  );
}
