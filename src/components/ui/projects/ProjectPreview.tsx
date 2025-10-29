import { EmptyState } from "@chakra-ui/react";

interface ProjectPreviewProps {
	selectedProject: string | null;
}

export function ProjectPreview({ selectedProject }: ProjectPreviewProps) {
	return (
		<EmptyState.Root>
			<EmptyState.Content>
				<EmptyState.Indicator>Выберите проект</EmptyState.Indicator>
				<EmptyState.Title />
				<EmptyState.Description />
			</EmptyState.Content>
		</EmptyState.Root>
	);
}
