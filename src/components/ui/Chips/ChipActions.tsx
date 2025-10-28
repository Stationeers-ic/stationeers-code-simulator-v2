import { Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuPlay, LuRedo, LuSave } from "react-icons/lu";
import { useInitIc10 } from "@/components/hooks/initIc10";
import { useIc10Store } from "@/stores/ic10Store";

export default function ChipActions() {
	const { t } = useTranslation();
	const { initialized, step } = useIc10Store();
	const { init } = useInitIc10();
	const save = () => {};
	return (
		<HStack>
			<Button size="sm" onClick={step} disabled={!initialized} colorScheme="blue">
				<LuPlay />
				{t("menu.step")}
			</Button>
			<Button size="sm" onClick={init} colorScheme="green">
				<LuRedo />
				{initialized ? t("menu.reset") : t("menu.initialize")}
			</Button>
			<Button size="sm" onClick={save} colorScheme="green">
				<LuSave />
				{t("menu.save")}
			</Button>
		</HStack>
	);
}
