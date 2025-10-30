// components/ChipActions.tsx
import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuSave } from "react-icons/lu";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useProjectStore } from "@/stores/projects";
import { useState } from "react";

export function Save() {
	const { t } = useTranslation();
	const { hasChange, setHasChange, getEnvConfig } = useInitialEnvStore();
	const { selectedProject, getSelectedProject } = useProjectStore();
	const [saving, setSaving] = useState(false);
	const enable = selectedProject && hasChange;

	const save = () => {
		const project = getSelectedProject();
		if (!project) throw new Error("Project not selected");
		setSaving(true);
		Promise.all([project.save(getEnvConfig())])
			.then(() => {
				setHasChange(false);
			})
			.finally(() => {
				setSaving(false);
			});
	};
	return (
		<Button size="sm" loading={saving} colorPalette="green" onClick={save} disabled={!enable}>
			<LuSave />
			{hasChange ? t("menu.save") : t("menu.saved")}
		</Button>
	);
}

export default Save;
