import { create } from "zustand";

type MapCenter = { lat: number | null; lng: number | null };

type MapViewState = {
	center: MapCenter;
	keyword: string;
	hasSearched: boolean;
	setCenter: (lat: number, lng: number) => void;
	setKeyword: (kw: string) => void;
	setHasSearched: (v: boolean) => void;
	reset: () => void;
};

export const useMapViewStore = create<MapViewState>((set) => ({
	center: { lat: null, lng: null },
	keyword: "",
	hasSearched: false,
	setCenter: (lat, lng) => set({ center: { lat, lng } }),
	setKeyword: (kw) => set({ keyword: kw }),
	setHasSearched: (v) => set({ hasSearched: v }),
	reset: () => set({ center: { lat: null, lng: null }, keyword: "", hasSearched: false })
}));