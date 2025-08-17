import { create } from "zustand";
import { PinCategoryType } from "../components/PinCategorySelector";

export type DraftMode = "new" | "existing" | null;

type PinDraftState = {
	// 공통(모달에서 입력)
	placeName: string;
	pinCategory: PinCategoryType | null;

	// 분기 제어 + 최소 데이터
	mode: DraftMode;
	placeId: number | null;       // existing 전용
	detailAddress: string | null; // both
	latitude: number | null;      // new 전용
	longitude: number | null;     // new 전용

	// 액션
	setMode: (m: DraftMode) => void;
	setExisting: (placeId: number, detailAddress: string) => void;
	setNew: (detailAddress: string, latitude: number, longitude: number) => void;
	setPlaceName: (v: string) => void;
	setPinCategory: (v: PinCategoryType | null) => void;
	reset: () => void;
};

const initial: Omit<PinDraftState, "setMode" | "setExisting" | "setNew" | "setPlaceName" | "setPinCategory" | "reset"> = {
	placeName: "",
	pinCategory: null,
	mode: null,
	placeId: null,
	detailAddress: null,
	latitude: null,
	longitude: null
};

export const usePinDraftStore = create<PinDraftState>()((set) => ({
	...initial,

	setMode: (mode) => set({ mode }),

	setExisting: (placeId, detailAddress) =>
		set({
			mode: "existing",
			placeId,
			detailAddress,
			latitude: null,
			longitude: null
		}),

	setNew: (detailAddress, latitude, longitude) =>
		set({
			mode: "new",
			detailAddress,
			latitude: Number(latitude.toFixed(5)),
			longitude: Number(longitude.toFixed(5)),
			placeId: null
		}),

	setPlaceName: (v) => set({ placeName: v }),
	setPinCategory: (v) => set({ pinCategory: v }),

	reset: () => set({ ...initial })
}));
