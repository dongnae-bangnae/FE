import { create } from "zustand";

type SaveModeState = {
    mode: 'write' | 'save';
    placeId: number | null;
    setSaveMode: (placeId: number) => void;
    reset: () => void;
};

export const useSaveModeStore = create<SaveModeState>((set) => ({
    mode: 'write',
    placeId: null,

    setSaveMode: (placeId) => set({
        mode: 'save',
        placeId: placeId,
    }),
    reset: () => set({
        mode: 'write',
        placeId: null,
    }),
}));