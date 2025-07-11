import sampleImage from "../../assets/record/img1.jpg";

interface PostCardPreviewProps {
  id: string;
  profileImage?: string;
  author: string;
  date: string;
  title: string;
  image?: string;
  onClick?: () => void;
}

function PostCardPreview({
  profileImage,
  author,
  date,
  title,
  image,
  onClick
}: PostCardPreviewProps) {
  return (
    <div
      onClick={onClick}
      className="w-[233px] h-[227px] flex-shrink-0 bg-white rounded-[10px] cursor-pointer shadow overflow-hidden"
    >
      {/* 이미지 */}
      <img
        src={image || sampleImage}
        alt="게시물 이미지"
        className="w-[233px] h-[145px] object-cover rounded-[10px]"
      />

      {/* 정보영역 */}
      <div className="h-[82px] px-[10px] pr-[51px] py-[13px] flex flex-col justify-between">
        {/* 작성자 */}
        <div className="flex items-center gap-[10px]">
          <img
            src={
              profileImage || "https://via.placeholder.com/34x34.png?text=👤"
            }
            alt="프로필"
            className="w-[34px] h-[34px] rounded-full object-cover"
          />
          <span className="text-[13px] text-black">{author}</span>
          <span className="text-[13px] text-[#888]">{date}</span>
        </div>

        {/* 제목 */}
        <div className="text-[13px] text-black font-medium truncate">
          {title}
        </div>
      </div>
    </div>
  );
}

export default PostCardPreview;
