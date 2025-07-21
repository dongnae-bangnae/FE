import Header from "../components/common/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import iconArts from "../assets/place/place-arts.svg";
import iconBar from "../assets/place/place-bar.svg";
import iconBooks from "../assets/place/place-books.svg";
import iconCafe from "../assets/place/place-cafe.svg";
import iconFood from "../assets/place/place-food.svg";
import iconOthers from "../assets/place/place-others.svg";
import iconSports from "../assets/place/place-sports.svg";
import iconWalk from "../assets/place/place-walk.svg";

import CheckIcon from "../assets/icon-checked.svg?react";

const categories = [
	{ id: "food", label: "맛집", color: "#FDF3F7", border: "#E94E77", icon: iconFood },
	{ id: "cafe", label: "카페", color: "#F3F0FF", border: "#7B61FF", icon: iconCafe },
	{ id: "bar", label: "술집", color: "#E8F3FF", border: "#419DCE", icon: iconBar },
	{ id: "walk", label: "산책", color: "#E9F8EF", border: "#498C6D", icon: iconWalk },
	{ id: "sports", label: "운동", color: "#F4F9FF", border: "#005B9D", icon: iconSports },
	{ id: "books", label: "서점", color: "#F1F1F1", border: "#333333", icon: iconBooks },
	{ id: "arts", label: "문화 예술", color: "#FDF4EA", border: "#C7763E", icon: iconArts },
	{ id: "others", label: "기타", color: "#E4E4E4", border: "#444444", icon: iconOthers },
];

function SelectedPinTypePage() {
	const navigate = useNavigate();
	const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
	const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

	const handleComplete = () => {
		if (!selectedPlace) {
			alert("카테고리를 선택해주세요!");
			return;
		}
		navigate("/record/:id");
	};

	return (
		<div className="min-h-screen bg-white">
			<Header
				title="장소 필터"
				underline={true}
				right={
					<button
						onClick={handleComplete}
						className={`whitespace-nowrap mr-4 px-4 py-2 text-sm font-medium rounded-md shadow-md
							${selectedPlace ? "bg-[#FFAC33] hover:bg-amber-500 cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}>
						완료
					</button>
				}
			/>

			<div className="px-10 py-5">
				{categories.map(({ id, label, icon, color, border }) => {
					const isActive = selectedPlace === id;
					const isHovered = hoveredPlace === id;
					return (
						<div
							key={id}
							onClick={() => setSelectedPlace(id)}
							onMouseEnter={() => setHoveredPlace(id)}
							onMouseLeave={() => setHoveredPlace(null)}
							className={`flex items-center justify-between px-4 py-3 rounded-2xl mb-5 cursor-pointer transition-all duration-200`}
							style={{
								backgroundColor: isActive ? color : "white",
								border: `1px solid ${isActive || isHovered ? border : "#e5e7eb"}`,
								boxShadow: isActive || isHovered ? `0 2px 3px -1px  ${border}60` : "",
							}}
						>
							<div className="flex items-center gap-3">
								<img src={icon} alt={label} className={`${id === "walk" ? "w-7 h-7" : "w-6 h-6"}`}/>
								<span className="font-normal">{label}</span>
							</div>

							{(isActive || isHovered) && (
								<CheckIcon className="w-5 h-5" style={{ color: border }} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default SelectedPinTypePage;
