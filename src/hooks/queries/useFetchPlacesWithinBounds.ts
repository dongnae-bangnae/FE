import { useQuery } from "@tanstack/react-query";
import { FetchPlacesParams, fetchPlacesWithinBounds } from "../../apis/place";

export const useFetchPlacesWithinBounds = (
	params: FetchPlacesParams,
	enabled: boolean = true
) => {
	return useQuery({
		queryKey: ["places", params],
		queryFn: () => fetchPlacesWithinBounds(params),
		enabled,
	});
};
