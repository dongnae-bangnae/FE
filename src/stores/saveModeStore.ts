import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SaveModeState = {
    mode: 'write' | 'save';
    placeId: number | null;
    setSaveMode: (placeId: number) => void;
    reset: () => void;
};

export const useSaveModeStore = create<SaveModeState>()(
    persist(
        (set) => ({
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
        }),
        {
            name: "save-mode-storage", // 로컬 스토리지에 저장될 키
            storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
        }
    )
);