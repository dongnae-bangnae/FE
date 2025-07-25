import { CategoryColorName } from "./categoryColors";

export interface Category {
    id: number;
    name: string; 
    color: CategoryColorName; 
}

export interface CreateCategoryRequest {
	name: string;
	color: CategoryColorName; 
}

export interface CreateCategoryResponse {
	categoryId: number;
	name: string;
	color: CategoryColorName;
}