// components/ChipActions.tsx
import { Button } from "@chakra-ui/react";
import equal from "fast-deep-equal";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuClipboardPaste } from "react-icons/lu";
import { string2Json } from "@/helpers";
import { getTempEnv, useInitialEnvStore } from "@/stores/initialEnvStore";

export function Restore() {
	const { t } = useTranslation();
	const { initialEnv, setEnvConfig } = useInitialEnvStore();
	const [eq, setEq] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			const TmpEnv = getTempEnv();
			if ("initialEnv" in TmpEnv) {
				const now_env = string2Json(initialEnv);
				const old_env = TmpEnv.initialEnv;
				const equal_env = equal(now_env, old_env);
				console.log(equal_env, old_env, now_env);

				setEq(equal_env);
			}
		}, 200);

		return () => clearTimeout(timer);
	}, [initialEnv]);

	const restore = () => {
		const TmpEnv = getTempEnv();
		if ("initialEnv" in TmpEnv) {
			setEnvConfig(TmpEnv.initialEnv);
			setEq(true);
		}
	};

	if (eq) {
		return null;
	}
	return (
		<Button size="sm" colorPalette="orange" onClick={restore}>
			<LuClipboardPaste />
			{t("menu.restore")}
		</Button>
	);
}

export default Restore;
