import { EmptyState } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface ProjectPreviewProps {
	selectedProject: string | null;
}

export function ProjectPreview({ selectedProject }: ProjectPreviewProps) {
	const { t } = useTranslation();
	return (
		<EmptyState.Root>
			<EmptyState.Content>
				<EmptyState.Indicator>{t("project.needSelect")}</EmptyState.Indicator>
				<EmptyState.Title />
				<EmptyState.Description />
			</EmptyState.Content>
		</EmptyState.Root>
	);
}
