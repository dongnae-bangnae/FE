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

const initial = {
	detailAddress: null,
	latitude: null,
	longitude: null,
	placeName: "",
	pinCategory: null
} as const satisfies PinDraftValues;

export const usePinDraftStore = create<PinDraftState>((set) => ({
	...initial,
	setFromMapClick: (addr, lat, lng) =>
		set({
			detailAddress: addr,
			latitude: Number(lat.toFixed(5)),
			longitude: Number(lng.toFixed(5))
		}),
	setPlaceName: (name) => set({ placeName: name }),
	setPinCategory: (cat) => set({ pinCategory: cat }),
	reset: () => set({ ...initial })
}));

export const selectDraftValues = (s: PinDraftState) => ({
	detailAddress: s.detailAddress,
	latitude: s.latitude,
	longitude: s.longitude,
	placeName: s.placeName,
	pinCategory: s.pinCategory
});