import { useMutation } from "@tanstack/react-query";
import { savePlaceToCategory } from "../../apis/place";

export const useSavePlaceToCategory = () => {
	return useMutation({
		mutationFn: ({placeId, categoryId}: { placeId: number; categoryId: number;}) => savePlaceToCategory(placeId, categoryId),
		onSuccess: () => {
			alert("장소가 카테고리에 저장되었습니다.");
		},
		onError: () => {
			alert("장소 저장에 실패했어요. 다시 시도해주세요!");
		},
	});
};