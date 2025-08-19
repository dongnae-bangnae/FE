import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { getColorCode } from "../utils/getColorCode";
import CategoryItem from "../components/common/CategoryItem";
import { useState } from "react";
import IconOption from "../assets/top/icon-option.svg?react";
import OptionMessage from "../components/common/OptionMessage";
import useFetchCategories from "../hooks/queries/useFetchCategories";
import { useSavePlaceToCategory } from "../hooks/mutations/useSavePlaceToCategory";
import { useCategorySelectionStore } from "../stores/categorySelection";
import { CategoryColorName } from "../types/categoryColors";
import MessagePopup from "../components/MessagePopup";
import { useSaveModeStore } from "../stores/saveModeStore";


function CategoryPage() {
	const navigate = useNavigate();

	const { mode, placeId: savePlaceId, reset: resetSaveMode } = useSaveModeStore();
	console.log("CategoryPage 렌더링 - 현재 모드:", mode, "현재 placeId:", savePlaceId);

	// 상태 관리 변수 
	const [selectedCategory, setSelectedCategory] = useState<{categoryId: number; name: string; color: CategoryColorName;} | null>(null);
	const [showEditPopup, setShowEditPopup] = useState(false);
	const [popup, setPopup] = useState<{ message: string; icon?: string } | null>(null);

	const {data: categories = [], isLoading, isError} = useFetchCategories(); 

	const { mutate: saveMutate } = useSavePlaceToCategory({
		onSuccess: () => {
			setPopup({ message: "장소가 카테고리에 저장되었습니다." });
			resetSaveMode(); 
			navigate("/map");
		},
		onError: () => {
			setPopup({ message: "장소 저장에 실패했어요. 다시 시도해주세요!" });
		},
	});

	const setSelection = useCategorySelectionStore((s) => s.setSelection); 


	const handleComplete = () => {
		if (!selectedCategory) return;

		if (mode === "write") {
			setSelection({
				categoryId: selectedCategory.categoryId,
				categoryName: selectedCategory.name,
				categoryColor: selectedCategory.color, 
			});
			navigate("/record/new/write");
			return; 

		} else if (mode === "save") {
			if (!savePlaceId) { 
				alert("저장할 장소 정보가 없습니다. 다시 시도해 주세요.");
				return;
			}
			saveMutate({ placeId: savePlaceId, categoryId: selectedCategory.categoryId });
		}
	};

	return (
		<div className="bg-[#F2F2F7] min-h-screen flex flex-col relative">
			<Header title="카테고리 설정" underline={false} bgColor="bg-[#F2F2F7]" 
					right={<button onClick={() => setShowEditPopup(!showEditPopup)}><IconOption className="w-6 h-6 mr-5" />{showEditPopup && <OptionMessage message="기존 카테고리 편집하기" onClick={() => navigate('/category/edit')}/>}</button>} />
			<div className="flex flex-col flex-1 items-center px-5 pt-5 pb-6">
				<div className="bg-white rounded-xl w-full max-w-[400px] px-5 pt-5 pb-10">
					{!isLoading && !isError && categories.map((cat) => (
						<CategoryItem
							key={cat.categoryId}
							name={cat.name}
							color={getColorCode(cat.color)}
							selected={selectedCategory?.name === cat.name}
							onClick={() => setSelectedCategory({ categoryId: cat.categoryId, name: cat.name , color: cat.color})}
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
				<button className={`mt-auto w-[320px] h-11 rounded-md ${
							selectedCategory
								? "bg-[#FFC064] hover:bg-[#FFB347] cursor-pointer"
								: "bg-[#D9D9D9] cursor-not-allowed"
						}`}
						disabled={!selectedCategory}
						onClick={handleComplete}
				>
					완료
				</button>
			</div>
			{popup && <MessagePopup message={popup.message} />}
		</div>
	);
}

export default CategoryPage;
