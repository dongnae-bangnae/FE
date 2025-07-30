import { CategoryColorName } from "./categoryColors";

export interface Category {
    categoryId: number;
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

export interface EditCategoryRequest {
	name: string;
	color: string;
}

export interface EditCategoryResponse {
	categoryId: number;
	name: string;
	color: string;
}