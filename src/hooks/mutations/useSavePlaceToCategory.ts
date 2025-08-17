import { useMutation } from "@tanstack/react-query";
import { savePlaceToCategory } from "../../apis/place";

type Args = { placeId: number; categoryId: number };
type Opts = {
	onSuccess?: () => void;
	onError?: (e: unknown) => void;
};

export const useSavePlaceToCategory = (opts?: Opts) => {
	return useMutation({
		mutationFn: ({ placeId, categoryId }: Args) =>
			savePlaceToCategory(placeId, categoryId),
		onSuccess: () => {
			opts?.onSuccess?.();
		},
		onError: (e) => {
			opts?.onError?.(e);
		},
	});
};
