import {  useState } from "react";
import CategoryColor from "../../assets/icon-writeCategoryColor.svg?react"; 
import CancelButton from "../../assets/icon-cancelPlaceName.svg?react";
import { getColorCode } from "../../utils/getColorCode";
import PinCategorySelector from "../PinCategorySelector";
import { useNavigate } from "react-router-dom";
import { useCategorySelectionStore } from "../../stores/categorySelection";
import { useShallow } from "zustand/react/shallow";
import { usePinDraftStore } from "../../stores/pinDraftStore";

interface PinCategoryModalProps {
  onClose: () => void;
}

const PinCategoryModal = ({ onClose }: PinCategoryModalProps) => {
  const navigate = useNavigate(); 

  // draft 
  const placeName = usePinDraftStore((s) => s.placeName);
  const pinCategory = usePinDraftStore((s) => s.pinCategory);
  const setPlaceName = usePinDraftStore((s) => s.setPlaceName);
	const setPinCategory = usePinDraftStore((s) => s.setPinCategory);

  // category 
    const { categoryName, categoryColor } = useCategorySelectionStore(
    useShallow((s) => ({
      categoryName: s.categoryName, 
      categoryColor: s.categoryColor 
    }))
  ); 

  // 유효성 검사
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const isPlaceNameEmpty = placeName.trim() === "";
  const isPinCategoryEmpty = pinCategory === null;
  const isValid = !isPlaceNameEmpty && !isPinCategoryEmpty;



  const handleSubmit = () => {
    setIsSubmitted(true);
    if (!isValid) return;
    navigate("/record/new/write");
		onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-[#000000]/30 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-[#FFFFFF] py-3 rounded-t-xl text-center w-[375px] shadow-2xs" onClick={(e) => e.stopPropagation()} >
        <div className="w-15 h-1 bg-gray-300 rounded-full mx-auto" />
        <div className="flex flex-row items-center gap-3">
          <CategoryColor className="w-13 h-13 ml-5 my-4" style={{color: getColorCode(categoryColor)}}/>
          <p className="font-medium">{categoryName}</p>
        </div>
        <div className="relative w-[320px] mx-auto">
          <input 
            type="text" 
            value={placeName}
            onChange={(e) => {
              setPlaceName(e.target.value);
              setIsSubmitted(false); // 입력하면 제출 상태 초기화
            }}
            className={`w-80 px-3 py-2 rounded-lg placeholder:text-sm focus:outline-none 
              ${isSubmitted && isPlaceNameEmpty ? "border-2 border-[#ff0000d4] placeholder-[#FF0000d4]" : "bg-[#ECECEC] placeholder:text-[#00000078] border-2 border-[#ECECEC]"}`}
            placeholder="장소명을 입력해 주세요" />
          <CancelButton 
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {setPlaceName(""); setIsSubmitted(false);}} />
        </div>
        <p className="text-sm py-3 text-left pl-8">장소 필터 선택</p>
        <div>
          <PinCategorySelector
						selected={pinCategory}
						onSelect={setPinCategory}
					/>
        </div>
        <button 
          className={`h-[45px] px-35 rounded-xl my-2 transition-all duration-200 ${isValid ? "bg-[#FFB54D] cursor-pointer" : "border-3 border-[#FFB54D]  cursor-not-allowed"}`}
          onClick={handleSubmit}
          style={{boxShadow: `3px 3px 4px -1px  #FFB54D60`}}>등록</button>
      </div>
    </div>
  );
};

export default PinCategoryModal;
