// components/ChipActions.tsx
import { Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuPlay, LuRedo } from "react-icons/lu";
import { useInitIc10 } from "@/components/hooks/initIc10";
import Restore from "@/components/ui/chips/Restore";
import Save from "@/components/ui/chips/Save";
import { useIc10Store } from "@/stores/ic10Store";

export default function ChipActions() {
	const { t } = useTranslation();
	const { initialized, step } = useIc10Store();
	const { init } = useInitIc10();

	return (
		<HStack>
			<Button size="sm" onClick={step} disabled={!initialized} colorPalette="blue">
				<LuPlay />
				{t("menu.step")}
			</Button>
			<Button size="sm" onClick={init} colorPalette="yellow">
				<LuRedo />
				{initialized ? t("menu.reset") : t("menu.initialize")}
			</Button>
			<Save />
			<Restore />
		</HStack>
	);
}
