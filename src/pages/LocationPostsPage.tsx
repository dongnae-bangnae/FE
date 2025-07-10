import { useParams } from "react-router-dom";

import Header from "../components/common/Header";

function LocationPostsPage() {
  const { placeId } = useParams<{ placeId: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={`${placeId}`} underline={true} />

      <div className="flex-1 px-4 py-6">
        {/* 게시물 리스트 컴포넌트 연결 예정 */}
      </div>
    </div>
  );
}

export default LocationPostsPage;
