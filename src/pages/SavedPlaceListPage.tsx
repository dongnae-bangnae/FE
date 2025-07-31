import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Header from "../components/common/Header";
import SavedPlaceItem from "../components/SavedPlaceItem";
import { useSavedPlaces } from "../hooks/queries/useSavedPlaces";

function SavedPlaceListPage() {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();
  const categoryId = Number(placeId); // 저장된 장소 카테고리 ID
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const location = useLocation();
  const state = location.state as { categoryName?: string };

  const { data: places, isLoading } = useSavedPlaces(categoryId);

  const isButtonActive = selectedPlaceId !== null;

  const selectedPlace = places?.find((p) => p.placeId === selectedPlaceId);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header title={state?.categoryName ?? "저장된 장소"} underline={true} />

      <div className="flex flex-col px-4 pt-4 pb-28">
        {isLoading && <div>불러오는 중...</div>}

        {places?.map((place) => (
          <SavedPlaceItem
            key={place.placeId}
            name={place.title}
            category={place.pinCategory}
            icon={place.pinCategory}
            selected={selectedPlaceId === place.placeId}
            onClick={() => setSelectedPlaceId(place.placeId)}
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] bg-white border-t border-[#999] px-4 py-3 flex justify-center gap-3 z-50">
        <button
          onClick={() => {
            if (!selectedPlace) return;
            navigate(
              `/map?lat=${selectedPlace.latitude}&lng=${selectedPlace.longitude}&name=${selectedPlace.title}`
            );
          }}
          disabled={!isButtonActive}
          className={`w-[120px] py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${
              isButtonActive
                ? "bg-[#E5E5E5] text-black hover:bg-[#FFC064] cursor-pointer"
                : "bg-[#ECECEC] cursor-not-allowed"
            }`}
        >
          지도 불러오기
        </button>

        <button
          onClick={() => {
            if (!selectedPlace) return;
            navigate(`/mypage/saved/${selectedPlace.placeId}/list`);
          }}
          disabled={!isButtonActive}
          className={`w-[120px] py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${
              isButtonActive
                ? "bg-[#E5E5E5] text-black hover:bg-[#FFC064] cursor-pointer"
                : "bg-[#ECECEC] cursor-not-allowed"
            }`}
        >
          게시물 확인
        </button>
      </div>
    </div>
  );
}

export default SavedPlaceListPage;
