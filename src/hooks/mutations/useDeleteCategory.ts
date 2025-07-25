import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../apis/category";

const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: number) => deleteCategory(categoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
        },
        onError: (e) => {
            console.error(e);
        }
    })
}

export default useDeleteCategory;