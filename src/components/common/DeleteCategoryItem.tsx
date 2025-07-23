import StarIcon from '../../assets/category-star.svg?react';
import DeleteIcon from '../../assets/icon-delete.svg?react';


interface CategoryItemProps {
	name: string;
	color: string;
	onClick?: () => void;
}

function DeleteCategoryItem({ name, color, onClick }: CategoryItemProps) {

	return (
		<div
			onClick={onClick}
			className={`flex items-center justify-between px-3 py-3 rounded-md mb-4 cursor-pointer transition-all hover:bg-[#FDF3F7]`}
			style={{
				outlineStyle: "solid",
				outlineWidth: "1px",
				outlineColor: "#E94E77", 
				boxShadow: `2px 3px 4px  #E94E7780`,
			}}>
			<div className="flex items-center gap-1.5">
				<StarIcon className="w-5 h-5" style={{ color: color, backgroundColor: "#FFFFFF", borderRadius: "9999px", }} />
				<span className="text-md text-black font-medium">{name}</span>
			</div>

			<DeleteIcon />
		</div>
	);
}

export default DeleteCategoryItem;
