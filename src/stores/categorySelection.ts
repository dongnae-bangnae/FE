import { create } from "zustand";
import { CategoryColorName } from "../types/categoryColors";

type CategorySelectionState = {
	categoryId: number | null;
	categoryName: string;
	categoryColor: CategoryColorName;
	setSelection: (s: { categoryId: number; categoryName: string; categoryColor: CategoryColorName }) => void;
	reset: () => void;
};

export const useCategorySelectionStore = create<CategorySelectionState>((set) => ({
	categoryId: null,
	categoryName: "카테고리",
	categoryColor: "BLACK",
	setSelection: ({ categoryId, categoryName, categoryColor }) => set({ categoryId, categoryName, categoryColor }),
	reset: () => set({ categoryId: null, categoryName: "카테고리", categoryColor: "BLACK" })
}));
