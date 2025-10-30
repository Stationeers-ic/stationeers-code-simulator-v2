import { Box, Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import type { RepoItem } from "@/core/repositories/Repo.class";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { type RepositoryKey, useProjectStore } from "@/stores/projects";
import ConfirmButton from "../ConfirmButton";

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
		<ButtonGroup w={"100%"} position={"relative"}>
			<Button
				w={"calc(100% - 40px)"}
				variant={ussed ? "outline" : selected ? "surface" : "ghost"}
				onClick={handleClick}
			>
				{buttonContent}
			</Button>
			<ConfirmButton
				onConfirm={(): void => {
					throw new Error("Function not implemented.");
				}}
				confirmMessage={`delete project   ? ${projectKey}`}
				confirmButtonText="delete"
			>
				<IconButton colorPalette={"red"} w={"40px"} variant="solid">
					<LuTrash2 />
				</IconButton>
			</ConfirmButton>
		</ButtonGroup>
	);
}

export default ProjectSelectItem;
