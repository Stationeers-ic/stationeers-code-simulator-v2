import { Box, Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuTrash2 } from "react-icons/lu";
import type { RepoItem } from "@/core/repositories/Repo.class";
import signal from "@/Signal";
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
	const { t } = useTranslation();
	const { hasChange } = useInitialEnvStore();
	const { getProject, selectedProject, resetSelectedProject } = useProjectStore();

	const [loading, setLoading] = useState(false);
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

	const deleteProject = async () => {
		const project = getProject(repository, projectKey);
		if (!project) {
			return;
		}
		try {
			setLoading(true);
			const projectName = project.name;
			project.delete();
			if (ussed) {
				resetSelectedProject();
			}
			signal.emit("projectDeleted", projectName);
		} catch (error) {
			console.error(`Error deleting project ${projectKey} from repository ${repository}:`, error);
		} finally {
			setLoading(false);
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
				onConfirm={deleteProject}
				confirmMessage={t("project.delete.confirm", { project: projectKey })}
				confirmButtonText={t("project.delete.button", { project: projectKey })}
			>
				<IconButton loading={loading} colorPalette={"red"} w={"40px"} variant="solid">
					<LuTrash2 />
				</IconButton>
			</ConfirmButton>
		</ButtonGroup>
	);
}

export default ProjectSelectItem;
