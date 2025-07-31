import { axiosInstance } from "./axiosInstance";

export interface FetchPlacesParams {
	latMin: number;
	latMax: number;
	lngMin: number;
	lngMax: number;
}

export const fetchPlacesWithinBounds = async ({
	latMin,
	latMax,
	lngMin,
	lngMax
}: FetchPlacesParams) => {
    console.log("[fetchPlacesWithinBounds] 호출 직전 파라미터 확인", {
		latMin,
		latMax,
		lngMin,
		lngMax
	});

    const { data } = await axiosInstance.get("/api/places/map", {
        params: {
			latMin,
			latMax,
			lngMin,
			lngMax
		},
    });
    return data.result.places; 
}; 