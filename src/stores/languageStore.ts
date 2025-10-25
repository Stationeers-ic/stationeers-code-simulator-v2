// stores/languageStore.ts

import i18n from "i18next";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LanguageState {
	currentLanguage: string;
	setLanguage: (language: string) => void;
}

// Функция для определения языка браузера с учетом доступных переводов
const getBrowserLanguage = (): string => {
	if (typeof window === "undefined") return "en";

	const supportedLanguages = ["en", "ru", "es", "fr", "de", "zh"];

	// Проверяем все языки браузера в порядке предпочтения
	const browserLangs = [navigator.language, ...(navigator.languages || []), navigator.language?.split("-")[0]].filter(
		Boolean,
	);

	for (const lang of browserLangs) {
		const found = supportedLanguages.find((supported) => lang.toLowerCase().startsWith(supported.toLowerCase()));
		if (found) return found;
	}

	return "en";
};

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set) => ({
			// Используем автоопределение как начальное значение
			currentLanguage: getBrowserLanguage(),
			setLanguage: (language: string) => {
				i18n.changeLanguage(language);
				set({ currentLanguage: language });
			},
		}),
		{
			name: "language-storage",
			// Добавляем миграцию для существующих пользователей
			migrate: (persistedState: any) => {
				if (!persistedState) return undefined;

				// Если в хранилище уже есть язык, используем его
				// Если нет - используем автоопределение
				return {
					...persistedState,
					currentLanguage: persistedState.currentLanguage || getBrowserLanguage(),
				};
			},
		},
	),
);
