import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateCategoryRequest } from "../../types/category";
import { createCategory } from "../../apis/category";

const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newCategory: CreateCategoryRequest) => createCategory(newCategory),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (e) => {
            console.log(e);
        },
    });
};

export default useCreateCategory;