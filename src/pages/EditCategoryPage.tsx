import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import { CategoryColorName } from "../types/categoryColors";
import { getColorCode } from "../utils/getColorCode";
import DeleteCategoryItem from "../components/common/DeleteCategoryItem";


function EditCategoryPage() {
	const navigate = useNavigate();

	const categories: { categoryId: number, name: string, color: CategoryColorName }[] = [
		{ categoryId: 0, name: "종로3가", color: "RED" },
		{ categoryId: 1, name: "상수동", color: "ORANGE" },
		{ categoryId: 2, name: "연남동", color: "SKYBLUE"}, 
	];

	return (
		<div className="bg-[#F2F2F7] min-h-screen flex flex-col relative">
			<Header title="카테고리 편집" underline={false} bgColor="bg-[#F2F2F7]" />
			<div className="flex flex-col flex-1 items-center px-5 pt-5 pb-6">
				<div className="bg-white rounded-xl w-full max-w-[400px] px-5 pt-5 pb-15 shadow"
                    style={{boxShadow: `2px 3px 4px  #E94E7780`}}>
					{categories.map((cat) => (
						<DeleteCategoryItem
							key={cat.categoryId}
							name={cat.name}
							color={getColorCode(cat.color)}
							onClick={() => navigate(`/category/edit/${cat.categoryId}`, {
								state: {
									name: cat.name,
									color: cat.color,
								}
							})}
						/>
					))}
				</div>
				<button className="mt-auto w-[320px] h-11 bg-[#FFC064] hover:bg-[#FFB347] rounded-md cursor-pointer"
						onClick={() => {
							navigate('/category');
						}}
				>
					완료
				</button>
			</div>
		</div>
	);
}

export default EditCategoryPage;
