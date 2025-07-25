import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { getColorCode } from "../utils/getColorCode";
import CategoryItem from "../components/common/CategoryItem";
import { useState } from "react";
import IconOption from "../assets/top/icon-option.svg?react";
import OptionMessage from "../components/common/OptionMessage";
import useFetchCategories from "../hooks/queries/useFetchCategories";


function CategoryPage() {
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [showEditPopup, setShowEditPopup] = useState(false);

	const {data: categories = [], isLoading, isError} = useFetchCategories(); 

	return (
		<div className="bg-[#F2F2F7] min-h-screen flex flex-col relative">
			<Header title="카테고리 설정" underline={false} bgColor="bg-[#F2F2F7]" 
					right={<button onClick={() => setShowEditPopup(!showEditPopup)}><IconOption className="w-6 h-6 mr-5" />{showEditPopup && <OptionMessage message="기존 카테고리 편집하기" onClick={() => navigate('/category/edit')}/>}</button>} />
			<div className="flex flex-col flex-1 items-center px-5 pt-5 pb-6">
				<div className="bg-white rounded-xl w-full max-w-[400px] px-5 pt-5 pb-10">
					{!isLoading && !isError && categories.map((cat) => (
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
							<span className="text-lg w-10 h-10 bg-gray-100 rounded-full flex flex-col justify-center items-center cursor-pointer font-bold">
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
