import { useQuery } from "@tanstack/react-query"
import { fetchCategory } from "../../apis/category"
import { Category } from "../../types/category";

const useFetchCategories = () => {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: fetchCategory,
    }); 
};

export default useFetchCategories;