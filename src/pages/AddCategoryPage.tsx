import { useState } from "react";
import Header from "../components/common/Header";
import { CategoryColorName, categoryColors } from "../types/categoryColors";
import { useNavigate } from "react-router-dom";
import useCreateCategory from "../hooks/mutations/useCreateCategory";

function AddCategoryPage() {
	const [categoryName, setCategoryName] = useState("");
	const [categoryColor, setCategoryColor] = useState<CategoryColorName | null>(null);

	const navigate = useNavigate();
	const isFormValid = categoryName.trim() !== "" && categoryColor !== null;

	const { mutate: createCategory } = useCreateCategory(); 

	const handleSubmit = () => {
		if (!categoryName || !categoryColor) return; 

		createCategory(
			{name: categoryName, color: categoryColor}, 
			{
				onSuccess: () => {
					navigate("/category");
				},
			}
		);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Header title="새 카테고리 추가" underline={false} />
			<div className="flex flex-col justify-between flex-1 px-10 py-6 items-center">
				<div className="w-full flex flex-wrap gap-2 ">
					<input
						type="text"
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder="새 카테고리명을 입력해주세요"
						className="border-b px-1 py-2 outline-none w-full"
					/>
					<div className="py-4 flex flex-col justify-center">
						<div className="text-sm mb-3">색상 선택</div>
						<div className="flex gap-1.5">
							{categoryColors.map(({ name, code }) => {
								const isSelected = categoryColor === name;
								return (
									<button
										key={name}
										onClick={() => setCategoryColor(name)}
										className="w-6 h-6 rounded-full mx-1 flex items-center justify-center"
										style={{ backgroundColor: code }}
									>
										{isSelected && (
											<div
												className="w-4.5 h-4.5 rounded-full border-3 border-white"
												style={{ backgroundColor: code }}
											/>
										)}
									</button>
								);
							})}

						</div>
					</div>
				</div>

				<button
					onClick={handleSubmit}
					disabled={!isFormValid}
					className={`items-center w-[320px] h-11 rounded-md ${
						isFormValid
							? "bg-[#FFC064] hover:bg-[#FFB347] cursor-pointer"
							: "bg-gray-300 cursor-not-allowed"
					}`}
				>
					완료
				</button>
			</div>
		</div>
	);
}

export default AddCategoryPage;
