import { useProjectStore } from "@/stores/projects";
import { EmptyState } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { JsonSchemaEditor } from "../JsonSchemaEditor";
import { useEnvSchema } from "@/hooks/useJsonSchema";

interface ProjectPreviewProps {
	selectedProject: string | null;
}

export function ProjectPreview({ selectedProject }: ProjectPreviewProps) {
	const { t } = useTranslation();
	const { getSelectedProject } = useProjectStore();
	const { schema, schemaUri } = useEnvSchema();
	const project = getSelectedProject();

	if (!project) {
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
	return (
		<JsonSchemaEditor
			key={selectedProject}
			value={project.toJson() || ""}
			height={"100%"}
			schema={schema}
			schemaUri={schemaUri}
		/>
	);
}
