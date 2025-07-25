import { Category, CreateCategoryRequest, CreateCategoryResponse } from "../types/category";
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