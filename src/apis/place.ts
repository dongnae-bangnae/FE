import { axiosInstance } from "./axiosInstance";

export interface FetchPlacesParams {
	latMin: number;
	latMax: number;
	lngMin: number;
	lngMax: number;
}

export const fetchPlacesWithinBounds = async (params: FetchPlacesParams) => {
    const { data } = await axiosInstance.get("/api/places/map", {
        params, 
    });
    return data.result.places; 
}; 