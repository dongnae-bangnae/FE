import { useState } from "react";
import Header from "../components/common/Header";
import { Check } from "lucide-react";
import { CategoryColorName, categoryColors } from "../types/categoryColors";

function AddCategoryPage() {
    const [categoryName, setCategoryName] = useState(""); 
    const [categoryColor, setCategoryColor] = useState<CategoryColorName | null>(null); 

    const isFormValid = categoryName.trim() !== "" && categoryColor !== null;

    return (
        <>
            <Header title="새 카테고리 추가" underline={true} />
            <div className="flex flex-col px-10 py-6 justify-center">
                <input 
                    type="text" 
                    value={categoryName} 
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="새 카테고리명을 입력해주세요"
                    className="border-b px-1 py-2 outline-none"
                />
                <div className="py-5">
                    <div className="text-sm">색상 선택</div>
                    <div className="flex flex-c">
                        {categoryColors.map(({name, code}) => (
                            <button
                                key={name}
                                onClick={() => setCategoryColor(name)}
                                style={{ backgroundColor: code }}
                                className="category-color-button"
                            >
                                {categoryColor === name && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-black" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    <button 
                        disabled={!isFormValid}
                        className={`mt-80 w-70 h-10 ${isFormValid ? "bg-amber-300 hover:bg-amber-400 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}>완료</button>
                </div>

            </div>

        </>
    );
}
export default AddCategoryPage;