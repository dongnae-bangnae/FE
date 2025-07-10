import Header from "../components/common/Header";

function MyPostListPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="게시물 확인" underline={true} />

      <div className="flex-1 px-4 py-6">
        {/* 게시물 리스트 컴포넌트 연결 예정 */}
      </div>
    </div>
  );
}

export default MyPostListPage;
