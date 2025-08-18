import iconART from "../assets/place/place-arts.svg?react";
import iconPUB from "../assets/place/place-bar.svg?react";
import iconBOOKSTORE from "../assets/place/place-books.svg?react";
import iconCAFE from "../assets/place/place-cafe.svg?react";
import iconFOOD from "../assets/place/place-food.svg?react";
import iconETC from "../assets/place/place-others.svg?react";
import iconEXERCISE from "../assets/place/place-sports.svg?react";
import iconWALK from "../assets/place/place-walk.svg?react";

export type PinCategoryType = "FOOD" | "CAFE" | "PUB" | "WALK" | "EXERCISE" | "BOOKSTORE" | "CULTURE_ART" | "ETC" | null;

interface PinCategory {
	id: PinCategoryType;
	Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	color: string; // 선택 시 색상
	border: string; 
}

const pinCategories: PinCategory[] = [
    { id: "FOOD",  color: "#E94E77", border:"#FDF5F9",  Icon: iconFOOD },
	{ id: "CAFE",  color: "#7B61FF", border:"#F3F0FF" , Icon: iconCAFE },
	{ id: "PUB",  color: "#419DCE", border:"#E8F3FF", Icon: iconPUB },
	{ id: "WALK",  color: "#498C6D", border: "#E9F8EF", Icon: iconWALK },
	{ id: "EXERCISE", color: "#005B9D", border: "#F4F9FF", Icon: iconEXERCISE },
	{ id: "BOOKSTORE", color: "#333333", border: "#F1F1F1", Icon: iconBOOKSTORE },
	{ id: "CULTURE_ART", color: "#C7763E", border: "#FDF4EA", Icon: iconART },
	{ id: "ETC", color: "#444444", border: "#E4E4E4", Icon: iconETC },
];

interface Props {
	selected: PinCategoryType;
	onSelect: (id: PinCategoryType) => void;
}

export default function PinCategorySelector({ selected, onSelect }: Props) {
	return (
		<div className="flex justify-center flex-wrap  py-2">
			{pinCategories.map(({ id, Icon, color, border }) => {
				const isSelected = selected === id;
				const isWalk = id === "WALK";

				return (
					<button
						key={id}
						onClick={() => onSelect(id)}
						className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${isSelected ? `border-3` : ""}`}
						style={{ 
							backgroundColor: "transparent",
							borderColor: isSelected ? border : undefined,
						}}
					>
						<Icon
                            className="w-5 h-5"
							style={{
								width: isWalk ? "25px" : "20px",
								height: isWalk ? "25px" : "20px",
								color: isSelected ? color : "#FFC064"
							}}
						/>
					</button>
				);
			})}
		</div>
	);
}