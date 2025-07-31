import Header from "../components/common/Header";
import PostCard from "../components/Home/PostCard";

function RecordListPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="게시물 확인" />

      {/* 게시물 리스트 - 가운데 정렬 + 30px 간격 */}
      <div className="py-6 space-y-[30px] flex flex-col items-center">
        <PostCard
          profileImage="https://via.placeholder.com/30"
          nickname="커비"
          category="카페"
          image="https://via.placeholder.com/360x200"
          content="연남동에서의 데이트"
          likes={10}
          comments={2}
          views={5}
        />
        <PostCard
          profileImage="https://via.placeholder.com/30"
          nickname="푸짐바요"
          category="푸드"
          image="https://via.placeholder.com/360x200"
          content="연남동 지브리 카페❤️🍇"
          likes={14}
          comments={3}
          views={8}
        />
        <PostCard
          profileImage="https://via.placeholder.com/30"
          nickname="뽀로로"
          category="맛집"
          image="https://via.placeholder.com/360x200"
          content="망원동 숨겨진 찐맛집🍜"
          likes={7}
          comments={1}
          views={3}
        />
      </div>
    </div>
  );
}

export default RecordListPage;
