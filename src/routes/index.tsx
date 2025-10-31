import { Grid, GridItem, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectList } from "@/components/ui/projects/ProjectList";
import { ProjectPreview } from "@/components/ui/projects/ProjectPreview";
import { RepositoryList } from "@/components/ui/projects/RepositoryList";
import type { RepoItem } from "@/core/repositories/Repo.class";
import { useProjectStore } from "@/stores/projects";
import signal from "@/Signal";

export const Route = createFileRoute("/")({
	component: Saves,
});

function Saves() {
	const { t } = useTranslation();
	const { repositories, projects, selectedRepository, selectedProject, getProject } = useProjectStore();
	const [selectedRepo, setSelectedRepo] = useState(selectedRepository);
	const [selectedProjectState, setSelectedProjectState] = useState<RepoItem | null>(null);
	useEffect(() => {
		if (selectedRepo && selectedProject) {
			const project = getProject(selectedRepo, selectedProject);
			if (project) {
				setSelectedProjectState(project);
			}
		}
	}, [selectedRepo, selectedProject]);

	useEffect(() => {
		const handleProjectDeleted = (name: string) => {
			if (selectedProjectState) {
				if (selectedProjectState.name === name) {
					setSelectedProjectState(null);
				}
			}
		};
		signal.on("projectDeleted", handleProjectDeleted);
		return () => {
			signal.off("projectDeleted", handleProjectDeleted);
		};
	}, [selectedProjectState, setSelectedProjectState]);

	return (
		<Grid templateColumns="1fr 1fr 4fr" templateRows={"1rem 1fr"} gap={6} mb={6} w="100%" h="100%">
			<GridItem>
				<Text>{t("project.header.repositories")}</Text>
			</GridItem>
			<GridItem>
				<Text>{t("project.header.projects")}</Text>
			</GridItem>
			<GridItem>
				<Text>{t("project.header.preview")}</Text>
			</GridItem>

			<GridItem>
				<RepositoryList
					repositories={repositories}
					selectedRepository={selectedRepo}
					onSelectRepository={setSelectedRepo}
				/>
			</GridItem>

			<GridItem>
				<ProjectList
					selectedRepository={selectedRepo}
					projects={projects}
					selectedProject={selectedProjectState}
					onSelectProject={setSelectedProjectState}
				/>
			</GridItem>

			<GridItem>
				<ProjectPreview project={selectedProjectState} />
			</GridItem>
		</Grid>
	);
}
