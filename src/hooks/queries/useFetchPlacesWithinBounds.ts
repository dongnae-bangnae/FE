import { useQuery } from "@tanstack/react-query";
import { FetchPlacesParams, fetchPlacesWithinBounds } from "../../apis/place";

export const useFetchPlacesWithinBounds = (
	params: FetchPlacesParams,
	enabled: boolean
) => {
	return useQuery({
		queryKey: ["places-within-bounds", params],
		queryFn: () => fetchPlacesWithinBounds(params),
		enabled,
		staleTime: 0,
	});
};
