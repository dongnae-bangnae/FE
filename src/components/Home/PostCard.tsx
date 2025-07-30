import likeIcon from "../../assets/icon-like.svg";
import commentIcon from "../../assets/icon-comment.svg";
import viewIcon from "../../assets/icon-ban.svg";

interface PostCardProps {
  profileImage: string;
  nickname: string;
  category: string;
  image?: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
}

export default function PostCard({
  profileImage,
  nickname,
  category,
  image,
  content,
  likes,
  comments,
  views
}: PostCardProps) {
  return (
    <div className="w-[360px] box-border border border-[#D9D9D9] rounded-[10px] overflow-hidden bg-white">
      {/* 상단 헤더 */}
      <div className="h-[47px] px-[10px] border-b border-[#D9D9D9] flex flex-col justify-center">
        <div className="flex items-center gap-[5px] w-[340px] h-[31px]">
          {/* 프로필 이미지 */}
          <div
            className="w-[25px] h-[28px] rounded-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${profileImage})`,
              backgroundColor: "lightgray"
            }}
          />
          {/* 닉네임 */}
          <span className="text-[13px] font-[200] text-black leading-none">
            {nickname}
          </span>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div
        className="w-full h-[201px] border border-[#D9D9D9]"
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundColor: "lightgray",
          backgroundPosition: "-0.073px -170.58px",
          backgroundSize: "100% 204.113%",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* 본문 */}
      <div className="h-[36px] px-[15px] py-[8px] text-sm flex items-center border border-transparent">
        {content}
      </div>

      {/* 하단 피드백 */}
      {/* 하단 피드백 */}
      <div
        className="h-[30px] px-[15px] text-xs text-black flex items-center justify-end gap-[5px] bg-white"
        style={{
          borderTop: "none",
          borderLeft: "1px solid #D9D9D9",
          borderRight: "1px solid #D9D9D9",
          borderBottom: "1px solid #D9D9D9",
          borderRadius: "0 0 10px 10px"
        }}
      >
        <div className="flex items-center gap-[5px]">
          <img src={likeIcon} alt="좋아요" className="w-[15px] h-[15px]" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-[5px]">
          <img src={commentIcon} alt="댓글" className="w-[15px] h-[15px]" />
          <span>{comments}</span>
        </div>
        <div className="flex items-center gap-[5px]">
          <img src={viewIcon} alt="조회수" className="w-[15px] h-[15px]" />
          <span>{views}</span>
        </div>
      </div>
    </div>
  );
}
