export default function SkeletonPostCard() {
  return (
    <div className="w-[360px] box-border border border-[#D9D9D9] rounded-[10px] overflow-hidden bg-white animate-pulse">
      {/* 상단: 카테고리 */}
      <div className="h-[40px] px-[15px] border-b border-[#D9D9D9] flex items-center gap-2">
        <div className="w-[18px] h-[18px] bg-gray-300 rounded-full" />
        <div className="w-[80px] h-[14px] bg-gray-300 rounded" />
      </div>

      {/* 이미지 영역 */}
      <div className="w-full h-[200px] bg-gray-300" />

      {/* 제목 */}
      <div className="h-[40px] px-[15px] py-[10px] flex items-center border-t border-[#D9D9D9]">
        <div className="w-[70%] h-[14px] bg-gray-300 rounded" />
      </div>

      {/* 하단: 피드백 아이콘들 */}
      <div className="h-[30px] px-[15px] flex items-center justify-end gap-[10px] border-t border-[#D9D9D9] bg-white">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-[5px]">
            <div className="w-[15px] h-[15px] bg-gray-300 rounded-full" />
            <div className="w-[10px] h-[10px] bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
