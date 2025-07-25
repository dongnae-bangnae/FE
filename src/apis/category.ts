import { Category, CreateCategoryRequest, CreateCategoryResponse, EditCategoryRequest } from "../types/category";
import { ApiResponse } from "../types/common";
import { axiosInstance } from "./axiosInstance";

export const fetchCategory = async (): Promise<Category[]> => {
    const {data} = await axiosInstance.get<ApiResponse<Category[]>>("/api/categories/my");
    return data.result; 
}

export const createCategory = async (payload: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    const {data} = await axiosInstance.post<ApiResponse<CreateCategoryResponse>>("/api/categories", payload);
    return data.result;
}

export const editCategory = async (categoryId: number, body: EditCategoryRequest) => {
	const { data } = await axiosInstance.put(`/api/categories/${categoryId}`, body);
	return data;
};

export const deleteCategory = async (categoryId: number) => {
    const { data } = await axiosInstance.delete(`/api/categories/${categoryId}`);
    return data; 
}