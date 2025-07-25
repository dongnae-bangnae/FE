import { useMutation } from "@tanstack/react-query";
import { editCategory } from "../../apis/category";
import { EditCategoryRequest } from "../../types/category";

const useEditCategory = () => {
    return useMutation({
        mutationFn: (payload: { categoryId: number; body: EditCategoryRequest }) => editCategory(payload.categoryId, payload.body),
        onError: (e) => {
            console.log(e);
        },
    });
}

export default useEditCategory;