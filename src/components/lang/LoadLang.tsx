// components/lang/LoadLang.tsx
import { i18n as ic10Lang } from "ic10";
import { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { Loading } from "@/components/chakra/Loading";
import HttpBackend from "i18next-http-backend";

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

// Функция загрузки языка для ic10Lang
async function loadIc10Language(lang: string) {
	const response = await fetch(
		`https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Languages/${lang}.json`,
	);
	if (!response.ok) {
		throw new Error(`Failed to load ic10 language: ${lang}`);
	}
	return response.json();
}

// Инициализация ic10Lang с динамической загрузкой
async function initIc10Lang(lang: string) {
	const resources = await loadIc10Language(lang);

	await ic10Lang.init({
		lng: lang,
		fallbackLng: "en",
		debug: false,
		resources: {
			[lang]: {
				translation: resources,
			},
		},
	});
}

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

				// Загружаем оба языка параллельно
				await Promise.all([i18n.changeLanguage(lang), initIc10Lang(lang)]);
			} catch (error) {
				console.error("Failed to initialize languages:", error);
				// Fallback на английский
				await Promise.all([i18n.changeLanguage("en"), initIc10Lang("en")]);
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

					// Загружаем новый язык для ic10
					const ic10Resources = await loadIc10Language(currentLanguage);

					// Переключаем оба языка параллельно
					await Promise.all([i18n.changeLanguage(currentLanguage), ic10Lang.changeLanguage(currentLanguage)]);

					// Добавляем ресурсы для ic10Lang если их еще нет
					if (!ic10Lang.hasResourceBundle(currentLanguage, "translation")) {
						ic10Lang.addResourceBundle(currentLanguage, "translation", ic10Resources, true, true);
					}
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
