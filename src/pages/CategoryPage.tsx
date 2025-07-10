import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { CategoryColorName } from "../types/categoryColors";
import { getColorCode } from "../utils/getColorCode";
import CategoryItem from "../components/common/CategoryItem";
import { useState } from "react";

function CategoryPage() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const categories: { name: string; color: CategoryColorName }[] = [
		{ name: "종로 3가", color: "green" },
		{ name: "상수동", color: "orange" },
		{ name: "연남동", color: "yellow" },
	];

	return (
		<div className="bg-[#F2F2F8] min-h-screen flex flex-col">
			<Header title="카테고리 설정" underline={false} bgColor="bg-[#F2F2F8]" />
			<div className="flex flex-col flex-1 items-center px-5 pt-5 pb-6">
				<div className="bg-white rounded-xl w-full max-w-[400px] px-5 pt-5 pb-10">
					{categories.map((cat) => (
						<CategoryItem
							key={cat.name}
							name={cat.name}
							color={getColorCode(cat.color)}
							selected={selectedCategory === cat.name}
							onClick={() => setSelectedCategory(cat.name)}
						/>
					))}
					<div className="mt-5">
						<button
							onClick={() => navigate("/category/new")}
							className="flex items-center text-sm text-black gap-1"
						>
							<span className="text-xl w-10 h-10 bg-gray-100 rounded-full flex flex-col justify-center items-center cursor-pointer">
								＋
							</span>
							<div className="ml-3 cursor-pointer flex items-center h-10">
								새 카테고리 만들기
							</div>
						</button>
					</div>
				</div>
				<button className="mt-auto w-[320px] h-11 bg-[#FFC064] hover:bg-[#FFB347] rounded-md cursor-pointer"
						onClick={() => {
							if (selectedCategory) {
							navigate("/record/:id", {
								state: {
								selectedCategory: selectedCategory,
								},
							});
							}
						}}
				>
					완료
				</button>
			</div>
		</div>
	);
}

export default CategoryPage;
