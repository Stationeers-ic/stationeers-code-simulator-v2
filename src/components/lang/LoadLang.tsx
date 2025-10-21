import { i18n as ic10Lang, Languages } from "ic10";
import { use } from "react";

// Создаём промис один раз вне компонента
const langPromise = ic10Lang.init({
	lng: "ru", // язык по умолчанию
	fallbackLng: "ru",
	debug: true,
	resources: Languages,
});

export function LoadLang() {
	use(langPromise);

	// biome-ignore lint/complexity/noUselessFragments: <>
	return <></>;
}

export default LoadLang;
