import { create } from "zustand";
import { PinCategoryType } from "../components/PinCategorySelector";

type PinDraftValues = {
	detailAddress: string | null;
	latitude: number | null;
	longitude: number | null;
	placeName: string;
	pinCategory: PinCategoryType | null;
};

type PinDraftActions = {
	setFromMapClick: (addr: string, lat: number, lng: number) => void;
	setPlaceName: (name: string) => void;
	setPinCategory: (cat: PinCategoryType | null) => void;
	reset: () => void;
};

export type PinDraftState = PinDraftValues & PinDraftActions;

const initial: PinDraftValues = {
	detailAddress: null,
	latitude: null,
	longitude: null,
	placeName: "",
	pinCategory: null
};

const EPS = 1e-6;
const eq = (a: number | null, b: number | null) =>
	a == null || b == null ? a === b : Math.abs(a - b) < EPS;

export const usePinDraftStore = create<PinDraftState>()((set, get) => ({
	...initial,

	setFromMapClick: (addr, lat, lng) =>
		set((s) => {
			const nextLat = Number(lat.toFixed(5));
			const nextLng = Number(lng.toFixed(5));
			const sameAddr = s.detailAddress === addr;
			const sameLat = eq(s.latitude, nextLat);
			const sameLng = eq(s.longitude, nextLng);
			if (sameAddr && sameLat && sameLng) return s; // 변화 없으면 no-op
			return {
				...s,
				detailAddress: addr,
				latitude: nextLat,
				longitude: nextLng
			};
		}),

	setPlaceName: (name) =>
		set((s) => (s.placeName === name ? s : { ...s, placeName: name })),

	setPinCategory: (cat) =>
		set((s) => (s.pinCategory === cat ? s : { ...s, pinCategory: cat })),

	reset: () => set({ ...initial })
}));

export const selectDraftValues = (s: PinDraftState) => ({
	detailAddress: s.detailAddress,
	latitude: s.latitude,
	longitude: s.longitude,
	placeName: s.placeName,
	pinCategory: s.pinCategory
});
