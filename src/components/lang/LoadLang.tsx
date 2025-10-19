import { i18n as ic10Lang } from "ic10";
import { use } from "react";

export function LoadLang() {
	use(ic10Lang.init());

	// biome-ignore lint/complexity/noUselessFragments: <>
	return <></>;
}

export default LoadLang;
