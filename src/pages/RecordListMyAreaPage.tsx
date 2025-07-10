import { useParams } from "react-router-dom";

import Header from "../components/common/Header";

function RecordListByAreaPage() {
  const { area } = useParams<{ area: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={`${area} 관련 게시물`} underline={true} />

      <div className="flex-1 px-4 py-6">
        <p className="text-sm text-gray-700">{area}에 대한 게시물 리스트</p>
        {/* 게시물 리스트 컴포넌트 연결 예정 */}
      </div>
    </div>
  );
}

export default RecordListByAreaPage;
