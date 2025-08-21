import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfrimWriteIcon from "../assets/icon-confirmWrite.svg?react";
import PlaceIcon from "../assets/icon-PinPlace.svg?react";
import SavePlaceIcon from "../assets/icon-savePlace.svg?react";
import { Place } from "../types/place";
import { useSaveModeStore } from "../stores/saveModeStore";

interface PinInfoModalProps {
  place: Place | null;
  onClose: () => void;
}

const pinCategoryMap: Record<string, string> = {
  FOOD: "맛집",
  CAFE: "카페",
  PUB: "술집",
  WALK: "산책",
  EXERCISE: "운동",
  BOOKSTORE: "서점",
  CULTURE_ART: "문화 예술",
  ETC: "기타"
};

export default function PinInfoModal({ place, onClose }: PinInfoModalProps) {
  if (!place) return null;

  // hover 여부
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [isWriteHovered, setIsWriteHovered] = useState(false);

  const placeName = place.title;
  const pinCategory = place.pinCategory;
  const detailAddress = place.address;
  const isSaved = place.isSaved;
  const placeId = place.placeId;

  console.log(isSaved);
  const { setSaveMode } = useSaveModeStore();
  const navigate = useNavigate();

  return (
    <div className="absolute bottom-0 left-0 w-full z-10 bg-white rounded-t-xl shadow-lg p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-1 ">
          <PlaceIcon className="w-9 h-9" />
          <p className="font-bold text-2xl mr-1 text-[#FF8400]">{placeName}</p>
          <p className="font-semibold text-md text-[#BCBCBC] mt-2">
            {pinCategoryMap[pinCategory] ?? pinCategory}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 text-2xl mb-5">
          ×
        </button>
      </div>
      <div className="ml-3 text-gray-500">{detailAddress}</div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => {
            if (isSaved) return;
            console.log("저장 모드 설정 시도 - placeId:", place.placeId);
            setSaveMode(place.placeId);
            navigate("/category");
          }}
          onMouseEnter={() => {
            if (!isSaved) setIsSaveHovered(true);
          }}
          onMouseLeave={() => {
            if (!isSaved) setIsSaveHovered(false);
          }}
          className={`flex items-center justify-center gap-2 px-3 rounded-lg py-1.5 text-sm 
                        ${
                          isSaved
                            ? "bg-[#FFE9C7B8] text-[#ff9900] cursor-not-allowed border-2 border-[#FFAC33]"
                            : "bg-[#D9D9D91A] text-[#8F8F8F] hover:text-[#FFAC33] hover:border-[#FFAC33] border border-transparent cursor-pointer"
                        } transition`}
          style={{
            boxShadow: isSaved
              ? "3px 3px 4px -1px rgba(255, 181, 77, 0.5)"
              : isSaveHovered
                ? "3px 3px 4px -1px rgba(255, 181, 77, 0.6))"
                : "none"
          }}
        >
          <SavePlaceIcon
            style={{
              color: isSaved ? "#FFAC33" : isSaveHovered ? "#FFAC33" : "#D9D9D9"
            }}
          />
          {isSaved ? "저장됨" : "내 장소 저장"}
        </button>
        <button
          onClick={() => navigate(`/record/list?placeId=${placeId}`)}
          onMouseEnter={() => setIsWriteHovered(true)}
          onMouseLeave={() => setIsWriteHovered(false)}
          className="flex items-center justify-center gap-2 px-3 rounded-md py-1.5 text-sm bg-[#D9D9D91A] text-[#8F8F8F]
                    border-1 border-transparent hover:border-[#FFAC33] hover:text-[#FFAC33] transition"
          style={{
            boxShadow: isWriteHovered
              ? "3px 3px 4px -1px rgba(255, 181, 77, 0.38)"
              : "none"
          }}
        >
          <ConfrimWriteIcon
            style={{ color: isWriteHovered ? "#FFAC33" : "#D9D9D9" }}
          />
          게시물 확인
        </button>
      </div>
    </div>
  );
}
