import { Box, Button } from "@chakra-ui/react";
import type { RepoItem } from "@/core/repositories/Repo.class";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { type RepositoryKey, useProjectStore } from "@/stores/projects";

interface ProjectSelectItemProps {
	repository: RepositoryKey;
	projectKey: string;
	selected: boolean;
	project: RepoItem;
	onSelect: (project: RepoItem) => void;
}

export function ProjectSelectItem({ repository, projectKey, selected, onSelect }: ProjectSelectItemProps) {
	const { hasChange } = useInitialEnvStore();
	const { getProject, selectedProject } = useProjectStore();
	const ussed = projectKey === selectedProject;
	const handleClick = () => {
		if (selected) {
			return;
		}
		const project = getProject(repository, projectKey);
		if (project) {
			onSelect(project);
		}
	};

	const buttonContent = (
		<>
			{projectKey}
			{ussed && hasChange && (
				<Box
					position="absolute"
					top="4px"
					right="4px"
					width="8px"
					height="8px"
					bg="red.500"
					borderRadius="full"
					pointerEvents="none"
				/>
			)}
		</>
	);

	return (
		<Button variant={ussed ? "outline" : selected ? "surface" : "ghost"} position="relative" onClick={handleClick}>
			{buttonContent}
		</Button>
	);
}

export default ProjectSelectItem;
