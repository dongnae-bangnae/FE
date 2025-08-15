import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CategoryColorName } from "../types/categoryColors";

type CategorySelectionState = {
    categoryId: number | null;
    categoryName: string; 
    categoryColor: CategoryColorName;
    setSelection: (s: { categoryId: number; categoryName: string; categoryColor: CategoryColorName }) => void;
    reset: () => void;
}; 

export const useCategorySelectionStore = create<CategorySelectionState>()(
	persist(
		(set) => ({
			categoryId: null,
			categoryName: "카테고리",
			categoryColor: "BLACK",
			setSelection: ({ categoryId, categoryName, categoryColor }) =>
				set({ categoryId, categoryName, categoryColor }),
			reset: () => set({ categoryId: null, categoryName: "카테고리", categoryColor: "BLACK" }),
		}),
		{
			name: "dnbn-category-selection",
			storage: createJSONStorage(() => sessionStorage), 
		}
	)
);