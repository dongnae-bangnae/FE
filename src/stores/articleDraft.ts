//작성 관리
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type DraftState = {
  title: string;
  content: string;
  selectedImages: string[]; 
  mainImageUuid: string | null;
  selectedDate: string;      

  // actions
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  setDate: (v: string) => void;
  addImages: (urls: string[]) => void;
  toggleImage: (src: string) => void;
  setMain: (uuid: string | null) => void;

  hydrateFromEdit: (form: {
    title: string;
    content: string;
    date: string;
    mainImageUuid?: string | null;
    imageUuids?: string[];
  }) => void;

  reset: () => void;
};

const today = () => new Date().toISOString().split("T")[0];

export const useArticleDraftStore = create<DraftState>()(
  devtools(
    persist(
      (set, get) => ({
        title: "",
        content: "",
        selectedImages: [],
        mainImageUuid: null,
        selectedDate: today(),

        setTitle: (v) => set({ title: v }),
        setContent: (v) => set({ content: v }),
        setDate: (v) => set({ selectedDate: v }),

        addImages: (urls) =>
          set((state) => {
           
            const merged = Array.from(new Set([...state.selectedImages, ...urls])).slice(0, 10);
           
            const main = state.mainImageUuid ?? (merged[0] ?? null);
            return { selectedImages: merged, mainImageUuid: main };
          }),

        toggleImage: (src) =>
          set((state) => {
            const exists = state.selectedImages.includes(src);
            let next = exists
              ? state.selectedImages.filter((s) => s !== src)
              : state.selectedImages.length >= 10
              ? state.selectedImages
              : [...state.selectedImages, src];

            let main = state.mainImageUuid;
            if (!exists && !main) main = src; // 처음 추가 시 main 설정
            if (exists && state.mainImageUuid === src) {
              // 메인 삭제되면 새 첫 번째로
              main = next[0] ?? null;
            }
            return { selectedImages: next, mainImageUuid: main };
          }),

        setMain: (uuid) => set({ mainImageUuid: uuid }),

        hydrateFromEdit: (form) =>
          set({
            title: form.title ?? "",
            content: form.content ?? "",
            selectedDate: form.date ?? today(),
            mainImageUuid: form.mainImageUuid ?? (form.imageUuids?.[0] ?? null),
            selectedImages: [
              ...(form.mainImageUuid ? [form.mainImageUuid] : []),
              ...(form.imageUuids ?? []),
            ].filter(Boolean) as string[],
          }),

        reset: () =>
          set({
            title: "",
            content: "",
            selectedImages: [],
            mainImageUuid: null,
            selectedDate: today(),
          }),
      }),
      {
        name: "article-draft",
       
        storage: createJSONStorage(() => sessionStorage),
       
        partialize: (state) => ({
          title: state.title,
          content: state.content,
          selectedImages: state.selectedImages,
          mainImageUuid: state.mainImageUuid,
          selectedDate: state.selectedDate,
        }),
      }
    )
  )
);
