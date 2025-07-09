import { useState } from "react";
import Header from "../components/common/Header";
import { Check } from "lucide-react";
import { CategoryColorName, categoryColors } from "../types/categoryColors";

function AddCategoryPage() {
	const [categoryName, setCategoryName] = useState("");
	const [categoryColor, setCategoryColor] = useState<CategoryColorName | null>(null);

	const isFormValid = categoryName.trim() !== "" && categoryColor !== null;

	return (
		<div className="flex flex-col min-h-screen">
			<Header title="새 카테고리 추가" underline={false} />
			<div className="flex flex-col justify-between flex-1 px-10 py-6 items-center">
				<div>
					<input
						type="text"
						value={categoryName}
						onChange={(e) => setCategoryName(e.target.value)}
						placeholder="새 카테고리명을 입력해주세요"
						className="border-b px-1 py-2 outline-none w-full"
					/>
					<div className="py-4 flex flex-col justify-center">
						<div className="text-sm mb-2">색상 선택</div>
						<div className="flex">
							{categoryColors.map(({ name, code }) => (
								<button
									key={name}
									onClick={() => setCategoryColor(name)}
									style={{ backgroundColor: code }}
									className="category-color-button relative"
								>
									{categoryColor === name && (
										<div className="absolute inset-0 flex items-center justify-center pt-1">
											<Check className="w-4 h-4 text-black" />
										</div>
									)}
								</button>
							))}
						</div>
					</div>
				</div>

				<button
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
