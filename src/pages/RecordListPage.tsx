import Header from "../components/common/Header";

function RecordListPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="게시물 확인" />

      {/* 여기에 게시물 리스트 들어갈 예정 */}
      <div className="p-4">
        <p className="text-gray-500 text-sm">
          여기에 게시물 목록이 표시됩니다.
        </p>
      </div>
    </div>
  );
}

export default RecordListPage;
