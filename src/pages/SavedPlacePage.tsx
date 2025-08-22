import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import pin_bookstore from "../assets/pin/pin_bookstore.svg";
import pin_cafe from "../assets/pin/pin_cafe.svg";
import pin_culture_art from "../assets/pin/pin_culture_art.svg";
import pin_etc from "../assets/pin/pin_etc.svg";
import pin_food from "../assets/pin/pin_food.svg";
import pin_pub from "../assets/pin/pin_pub.svg";
import pin_exercise from "../assets/pin/pin_sports.svg";
import pin_walk from "../assets/pin/pin_walk.svg";
import Header from "../components/common/Header";
import SavedPlaceItem from "../components/SavedPlaceItem";
import { useSavedPlaces } from "../hooks/queries/useSavedPlaces";

const pinIcons: Record<string, string> = {
  FOOD: pin_food,
  CAFE: pin_cafe,
  PUB: pin_pub,
  WALK: pin_walk,
  EXERCISE: pin_exercise,
  BOOKSTORE: pin_bookstore,
  CULTURE_ART: pin_culture_art,
  ETC: pin_etc
};

export default function SavedPlacePage() {
  const navigate = useNavigate();

  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryIdNum = Number(categoryId);

  const location = useLocation();
  const state = location.state as { categoryName?: string } | undefined;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSavedPlaces(categoryIdNum, 20);

  const places = useMemo(
    () => data?.pages.flatMap((p) => p.places) ?? [],
    [data]
  );

  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const selectedPlace =
    places.find((p) => p.placeId === selectedPlaceId) ?? null;
  const isButtonActive = !!selectedPlace;

  useEffect(() => {
    console.log("카테고리 ID:", categoryIdNum);
    console.log("받은 장소 데이터:", places);
  }, [places, categoryIdNum]);

  if (!Number.isFinite(categoryIdNum) || categoryIdNum <= 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Header title="저장된 장소" underline={true} />
        <div className="p-4">유효하지 않은 카테고리입니다.</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header title={state?.categoryName ?? "저장된 장소"} underline={true} />

      <div className="flex flex-col px-4 pt-4 pb-28">
        {isLoading && <div>불러오는 중...</div>}

        {places.map((place) => (
          <SavedPlaceItem
            key={place.placeId}
            name={place.title}
            category={place.pinCategory}
            icon={pinIcons[place.pinCategory] ?? pin_etc}
            selected={selectedPlaceId === place.placeId}
            onClick={() => setSelectedPlaceId(place.placeId)}
          />
        ))}

        {hasNextPage && (
          <button
            className="mt-3 w-full rounded-md border py-2"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] bg-white border-t border-[#999] px-4 py-3 flex justify-center gap-3 z-50">
        <button
          onClick={() => {
            if (!selectedPlace) return;
            const range = 0.01;
            navigate(
              `/mypage/saved/map?latMin=${selectedPlace.latitude - range}&latMax=${
                selectedPlace.latitude + range
              }&lngMin=${selectedPlace.longitude - range}&lngMax=${
                selectedPlace.longitude + range
              }`
            );
          }}
          disabled={!isButtonActive}
          className={`w-[120px] py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${isButtonActive ? "bg-[#E5E5E5] text-black hover:bg-[#FFC064] cursor-pointer" : "bg-[#ECECEC] cursor-not-allowed"}`}
        >
          지도 불러오기
        </button>

        <button
          onClick={() => {
            if (!selectedPlace) return;
            navigate(`/mypage/saved/${selectedPlace.placeId}/list`, {
              state: { placeName: selectedPlace.title }
            });
          }}
          disabled={!isButtonActive}
          className={`w-[120px] py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${isButtonActive ? "bg-[#E5E5E5] text-black hover:bg-[#FFC064] cursor-pointer" : "bg-[#ECECEC] cursor-not-allowed"}`}
        >
          게시물 확인
        </button>
      </div>
    </div>
  );
}
