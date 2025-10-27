// components/lang/LoadLang.tsx

import { i18n as ic10Lang } from "@stationeers-ic/ic10";
import { LocaleDataManager } from "@stationeers-ic/monaco-lang-ic10";
import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";
import { Loading } from "@/components/chakra/Loading";
import { useLanguageStore } from "@/stores/languageStore";

// Инициализация i18next с динамической загрузкой
i18n
	.use(HttpBackend)
	.use(initReactI18next)
	.init({
		lng: "en",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: "/locales/{{lng}}.json",
		},
	});

ic10Lang.use(HttpBackend).init({
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	backend: {
		loadPath: "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Languages/{{lng}}.json",
	},
});
export function LoadLang() {
	const { currentLanguage } = useLanguageStore();
	const [isLoading, setIsLoading] = useState(true);
	const [isChangingLanguage, setIsChangingLanguage] = useState(false);

	// Первичная загрузка языков
	useEffect(() => {
		const initLanguages = async () => {
			try {
				setIsLoading(true);
				const lang = currentLanguage || "en";
				LocaleDataManager.loadLocale("ru", (await import("@stationeers-ic/monaco-lang-ic10")).localeRU)
				LocaleDataManager.setDefaultLocale(lang);
				// Загружаем оба языка параллельно
				await Promise.all([i18n.changeLanguage(lang), ic10Lang.changeLanguage(lang)]);
			} catch (error) {
				console.error("Failed to initialize languages:", error);
				// Fallback на английский
				await Promise.all([i18n.changeLanguage("en"), ic10Lang.changeLanguage("en")]);
			} finally {
				setIsLoading(false);
			}
		};

		initLanguages();
	}, []);

	// Переключение языка
	useEffect(() => {
		if (isLoading) return; // Пропускаем при первичной загрузке

		const changeLanguage = async () => {
			if (currentLanguage && i18n.language !== currentLanguage) {
				try {
					setIsChangingLanguage(true);
					LocaleDataManager.setDefaultLocale(currentLanguage);
					// Переключаем оба языка параллельно
					await Promise.all([i18n.changeLanguage(currentLanguage), ic10Lang.changeLanguage(currentLanguage)]);
				} catch (error) {
					console.error("Failed to change language:", error);
				} finally {
					setIsChangingLanguage(false);
				}
			}
		};

		changeLanguage();
	}, [currentLanguage, isLoading]);

	if (isLoading || isChangingLanguage) {
		return <Loading />;
	}

	return null;
}

export default LoadLang;
