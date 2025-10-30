// stores/languageStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { json2string, string2Json } from "@/helpers";

interface LanguageState {
	currentLanguage: string;
	setLanguage: (language: string) => void;
}

// Функция для определения языка браузера с учетом доступных переводов
export const getBrowserLanguage = (): string => {
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

// Получаем начальный язык (из localStorage или браузера)
export const getInitialLanguage = (): string => {
	if (typeof window === "undefined") return "en";

	try {
		const stored = localStorage.getItem("language-storage");
		if (stored) {
			const parsed = string2Json<any>(stored);
			return parsed.state?.currentLanguage || getBrowserLanguage();
		}
	} catch (error) {
		console.error("Error reading from localStorage:", error);
	}

	const lang = getBrowserLanguage();
	localStorage.setItem("language-storage", json2string({ state: { currentLanguage: lang } }, true));
	return lang;
};

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set) => ({
			currentLanguage: getInitialLanguage(),
			setLanguage: (language: string) => {
				set({ currentLanguage: language });
			},
		}),
		{
			name: "language-storage",
		},
	),
);
