import { useState } from "react";
import PlaceIcon from "../assets/icon-PinPlace.svg?react"
import SavePlaceIcon from "../assets/icon-savePlace.svg?react"
import ConfrimWriteIcon from  "../assets/icon-ConfirmWrite.svg?react"
import { Place } from "../types/place";

interface PinInfoModalProps {
	place: Place | null;
    onClose: () => void;
}

export default function PinInfoModal({ place, onClose }: PinInfoModalProps) {
    if (!place) return null;

    // hover 여부 
    const [isSaveHovered, setIsSaveHovered] = useState(false);
    const [isWriteHovered, setIsWriteHovered] = useState(false);

    const placeName = place.title;
	const pinCategory = place.pinCategory;
	const detailAddress = place.address;

	return (
		<div className="absolute bottom-0 left-0 w-full z-10 bg-white rounded-t-xl shadow-lg p-4">
            <div className="flex justify-between items-center">
				<div className="flex flex-row gap-2 ">
                    <PlaceIcon className="w-9 h-9"/>
                    <p className="font-bold text-2xl text-[#FF8400]">{placeName}</p>
                    <p className="font-semibold text-md text-[#BCBCBC] mt-2">{pinCategory}</p>
                </div>
				<button onClick={onClose} className="text-gray-500 text-2xl mb-5">×</button>
			</div>
            <div className="ml-3 text-gray-500">
                {detailAddress}
            </div>
			<div className="flex items-center justify-center gap-4 mt-4">
				<button 
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}    
                    className="flex items-center justify-center gap-2 px-3 rounded-lg py-1.5 text-sm bg-[#D9D9D91A] text-[#8F8F8F] 
                    border-1 border-transparent hover:border-[#FFAC33] hover:text-[#FFAC33] transition"
                    style={{ boxShadow: isSaveHovered ? "3px 3px 4px -1px rgba(255, 181, 77, 0.38)" : "none"}}>
                    <SavePlaceIcon style={{ color: isSaveHovered ? "#FFAC33" : "#D9D9D9" }} />
					내 장소 저장
				</button>
				<button
                    onMouseEnter={() => setIsWriteHovered(true)}
                    onMouseLeave={() => setIsWriteHovered(false)}  
                    className="flex items-center justify-center gap-2 px-3 rounded-md py-1.5 text-sm bg-[#D9D9D91A] text-[#8F8F8F]
                    border-1 border-transparent hover:border-[#FFAC33] hover:text-[#FFAC33] transition"
                    style={{ boxShadow: isWriteHovered ? "3px 3px 4px -1px rgba(255, 181, 77, 0.38)" : "none"}}>
					<ConfrimWriteIcon style={{ color: isWriteHovered ? "#FFAC33" : "#D9D9D9" }}/>
                    게시물 확인
				</button>
			</div>
		</div>
	);
}
