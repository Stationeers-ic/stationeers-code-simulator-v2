// stores/languageStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import CodeStorages, { type CodeStorage, type StoredItem } from "@/core/CodeStorage.class";

interface CodeStoreState {
	currentSave: Omit<StoredItem, "env"> | null;
	setCurrentSave: (curent: Omit<StoredItem, "env"> | null) => void;
	defaultCodeStore: string;
	getDefaultCodeStore: () => CodeStorage;
	setDefaultCodeStore: (store: string) => void;
}

export const useLCodeStoreStore = create<CodeStoreState>()(
	persist(
		(set, get) => ({
			currentSave: null,
			setCurrentSave: (current: Omit<StoredItem, "env"> | null) => {
				if (current) {
					set({ currentSave: current });
				} else {
					set({ currentSave: null });
				}
			},
			defaultCodeStore: "",
			getDefaultCodeStore() {
				const d = get().defaultCodeStore;
				if (d) {
					if (typeof CodeStorages[d] !== "undefined") {
						return CodeStorages[d];
					}
				}
				const newD = Object.keys(CodeStorages)[0];
				set({ defaultCodeStore: newD });
				return CodeStorages[newD];
			},
			setDefaultCodeStore(store: string) {
				set({ defaultCodeStore: store });
			},
		}),
		{
			name: "default-codestore",
		},
	),
);
