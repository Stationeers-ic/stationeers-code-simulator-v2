// components/lang/LoadLang.tsx
import { useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";
import { i18n as ic10Lang } from "ic10";

// --- Динамический загрузчик для i18next ---
async function fetchI18nResource(lang: string) {
	const res = await fetch(`/locales/${lang}.json`);
	if (!res.ok) throw new Error(`Failed to load /locales/${lang}.json`);
	return await res.json();
}

// --- Динамический загрузчик для ic10Lang ---
async function fetchIc10Resource(lang: string) {
	const res = await fetch(
		`https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Languages/${lang}.json`,
	);
	if (!res.ok) throw new Error(`Failed to load ic10 lang ${lang}`);
	return await res.json();
}

// --- Инициализация i18next (один раз) ---
let i18nInitialized = false;
async function initI18n(lang: string) {
	if (!i18nInitialized) {
		const resource = await fetchI18nResource(lang);
		await i18n.use(initReactI18next).init({
			resources: { [lang]: { translation: resource } },
			lng: lang,
			fallbackLng: "en",
			interpolation: { escapeValue: false },
		});
		i18nInitialized = true;
	} else {
		const resource = await fetchI18nResource(lang);
		i18n.addResourceBundle(lang, "translation", resource, true, true);
		i18n.changeLanguage(lang);
	}
}

// --- Инициализация ic10Lang (один раз) ---
let ic10Initialized = false;
async function initIc10Lang(lang: string) {
	const resource = await fetchIc10Resource(lang);
	if (!ic10Initialized) {
		await ic10Lang.init({
			lng: lang,
			fallbackLng: "en",
			debug: false,
			resources: { [lang]: resource },
		});
		ic10Initialized = true;
	} else {
		ic10Lang.addResourceBundle(lang, resource);
		ic10Lang.changeLanguage(lang);
	}
}

// --- Suspense-friendly загрузчик ---
function useLangLoader(lang: string) {
	// Suspense: выбрасываем промис, пока не загрузится
	if (!i18nInitialized || i18n.language !== lang) {
		throw Promise.all([initI18n(lang), initIc10Lang(lang)]);
	}
}

export function LoadLang() {
	const { currentLanguage } = useLanguageStore();
	const lang = currentLanguage || "en";
	useLangLoader(lang);

	// Синхронизация языка при смене currentLanguage
	useEffect(() => {
		if (i18n.language !== lang) {
			i18n.changeLanguage(lang);
			ic10Lang.changeLanguage(lang);
		}
	}, [lang]);

	return null;
}

export default LoadLang;
