import { CategoryColorName, categoryColors } from "../types/categoryColors";

export const getColorCode = (colorName: CategoryColorName): string => {
	return categoryColors.find((c) => c.name === colorName)?.code ?? "#000000";
};
