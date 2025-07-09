import Header from "../components/common/Header";
import iconArts from "../assets/place/place-arts.png";
import iconBar from "../assets/place/place-bar.png";
import iconBooks from "../assets/place/place-books.png";
import iconCafe from "../assets/place/place-cafe.png";
import iconFood from "../assets/place/place-food.png";
import iconOthers from "../assets/place/place-others.png";
import iconSports from "../assets/place/place-sports.png";
import iconWalk from "../assets/place/place-walk.png";
import CheckedIcon from "../assets/category-checked.png";
import UncheckedIcon from "../assets/category-unchecked2.png";
import { useState } from "react";


const categories = [
	{ id: "food", label: "맛집", color: "#FDF3F7", icon: iconFood },
	{ id: "cafe", label: "카페", color: "#F3F0FF", icon: iconCafe },
	{ id: "bar", label: "술집", color: "#E8F3FF", icon: iconBar },
	{ id: "walk", label: "산책", color: "#E9F8EF", icon: iconWalk },
	{ id: "sports", label: "운동", color: "#F4F9FF", icon: iconSports },
	{ id: "books", label: "서점", color: "#F1F1F1", icon: iconBooks },
	{ id: "arts", label: "문화 예술", color: "#FDF4EA", icon: iconArts },
	{ id: "others", label: "기타", color: "#E4E4E4", icon: iconOthers },
];


function SelectedPinTypePage() {
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
    const handleComplete = () => {
		if (!selectedPlace) {
			alert("카테고리를 선택해주세요!");
			return;
		}
		console.log("선택된 카테고리:", selectedPlace);
	};

    return (
        <div className="min-h-screen bg-white">
            <Header 
                title="장소 필터" 
                underline={true}
                right={<button
                            disabled={!selectedPlace}
                            onClick={handleComplete}
                            className={`whitespace-nowrap mr-4 px-5 py-2  text-sm font-medium rounded-md
                            ${selectedPlace ? "bg-[#FFAC33] hover:bg-amber-500 cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}>완료</button>} />
            <div className="px-10 py-5">
				{categories.map(({ id, label, icon, color }) => (
					<div
						key={id}
						onClick={() => setSelectedPlace(id)}
						className="flex items-center justify-between px-4 py-3 rounded-2xl mb-5 cursor-pointer"
						style={{ backgroundColor: color }}
					>
						<div className="flex items-center gap-3">
							<img src={icon} alt={label} className="w-5 h-5" />
							<span className=" font-normal">{label}</span>
						</div>

						{selectedPlace === id ? <img src={CheckedIcon}/> : <img src={UncheckedIcon}/>}
					</div>
				))}
			</div>
        </div>
    );
}
export default SelectedPinTypePage;
