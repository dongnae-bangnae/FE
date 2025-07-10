import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/common/Header";
import SavedPlaceItem from "../components/SavedPlaceItem";
import { savedPlaces } from "../dummyData/savedPlaces";

function SavedPlaceListPage() {
  const navigate = useNavigate();
  const { areaName = "연남동" } = useParams();
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const places = savedPlaces[areaName] || [];

  const isButtonActive = selectedPlace !== null;

  const handleRecordClick = () => {
    if (!selectedPlace) return;
    navigate(`/record?placeId=${selectedPlace}`);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header title={areaName} underline={true} />

      <div className="flex flex-col px-4 pt-4 pb-28">
        {places.map((place) => (
          <SavedPlaceItem
            key={place.id}
            name={place.name}
            category={place.category}
            icon={place.icon}
            selected={selectedPlace === place.id}
            onClick={() => setSelectedPlace(place.id)}
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] bg-white border-t border-[#E5E5E5] px-4 py-3 flex justify-center gap-3 z-50">
        <button
          onClick={() => {
            const selected = places.find((p) => p.id === selectedPlace);
            if (!selected) return;
            navigate(
              `/map?lat=${selected.lat}&lng=${selected.lng}&name=${selected.name}`
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
          onClick={handleRecordClick}
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
