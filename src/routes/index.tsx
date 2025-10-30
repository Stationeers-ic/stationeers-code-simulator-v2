import { Grid, GridItem, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ProjectList } from "@/components/ui/projects/ProjectList";
import { ProjectPreview } from "@/components/ui/projects/ProjectPreview";
import { RepositoryList } from "@/components/ui/projects/RepositoryList";
import { useProjectStore } from "@/stores/projects";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: Saves,
});

function Saves() {
	const { t } = useTranslation();
	const { repositories, projects, selectedRepository, setSelectedProject, selectedProject } = useProjectStore();
	const [selectedRepo, setSelectedRepo] = useState(selectedRepository);

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
					selectedProject={selectedProject}
					onSelectProject={setSelectedProject}
				/>
			</GridItem>

			<GridItem>
				<ProjectPreview selectedProject={selectedProject} />
			</GridItem>
		</Grid>
	);
}
