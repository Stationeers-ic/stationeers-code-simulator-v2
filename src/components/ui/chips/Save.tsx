// components/ChipActions.tsx
import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuSave } from "react-icons/lu";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useProjectStore } from "@/stores/projects";

export function Save() {
	const { t } = useTranslation();
	const { hasChange } = useInitialEnvStore();
	const { selectedProject } = useProjectStore();

	const enable = selectedProject && hasChange;

	const save = () => {};
	return (
		<Button size="sm" colorPalette="green" onClick={save} disabled={!enable}>
			<LuSave />
			{hasChange ? t("menu.save") : t("menu.saved")}
		</Button>
	);
}

export default Save;
