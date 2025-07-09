import CheckedIcon from "../../assets/category-checked.png";
import UncheckedIcon from "../../assets/category-unchecked.png";
import StarIcon from "../../assets/category-star.png";

interface CategoryItemProps {
	name: string;
	color: string;
	selected?: boolean;
	onClick?: () => void;
}

function CategoryItem({ name, color, selected = false, onClick }: CategoryItemProps) {
	return (
		<div
			onClick={onClick}
			className="flex items-center justify-between px-4 py-3 rounded-md mb-3 cursor-pointer"
			style={{ backgroundColor: `${color}AA` }}
		>
			<div className="flex items-center gap-1.5">
				<img src={StarIcon} className="w-5" />
				<span className="text-sm text-black font-medium">{name}</span>
			</div>

			<img
				src={selected ? CheckedIcon : UncheckedIcon}
				className="w-4 h-4"
				alt={selected ? "선택됨" : "선택 안 됨"}
			/>
		</div>
	);
}

export default CategoryItem;
