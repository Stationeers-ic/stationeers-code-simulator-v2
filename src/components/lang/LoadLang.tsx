import { i18n as ic10Lang } from "ic10";
import { use } from "react";

// Создаём промис один раз вне компонента
const langPromise = ic10Lang.init();

export function LoadLang() {
	use(langPromise);

	// biome-ignore lint/complexity/noUselessFragments: <>
	return <></>;
}

export default LoadLang;
