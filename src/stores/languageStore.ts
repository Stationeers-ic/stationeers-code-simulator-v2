// stores/languageStore.ts

import i18n from "i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
	currentLanguage: string;
	setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set) => ({
			currentLanguage: "ru",
			setLanguage: (language: string) => {
				i18n.changeLanguage(language);
				set({ currentLanguage: language });
			},
		}),
		{
			name: "language-storage", // ключ в localStorage
		},
	),
);
