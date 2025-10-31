import { EmptyState, Separator, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import CreateProjectDialog from "@/components/ui/projects/CreateProjectDialog";
import ProjectSelectItem from "@/components/ui/projects/ProjectSelectItem";
import type { RepoItem } from "@/core/repositories/Repo.class";
import type { ProjectLists, RepositoryKey } from "@/stores/projects";

interface ProjectListProps {
	selectedRepository: RepositoryKey | null;
	projects: ProjectLists;
	selectedProject: RepoItem | null;
	onSelectProject: (project: RepoItem) => void;
}

export function ProjectList({ selectedRepository, projects, selectedProject, onSelectProject }: ProjectListProps) {
	const { t } = useTranslation();
	const hasProjects =
		selectedRepository &&
		typeof projects[selectedRepository] !== "undefined" &&
		Object.keys(projects[selectedRepository]).length > 0;

	if (!hasProjects) {
		return (
			<VStack align="stretch">
				{selectedRepository ? <CreateProjectDialog repository={selectedRepository} /> : null}
				<EmptyState.Root>
					<EmptyState.Content>
						<EmptyState.Indicator>
							{selectedRepository ? t("project.notFound") : t("project.repository.needSelect")}
						</EmptyState.Indicator>
						<EmptyState.Title />
						<EmptyState.Description />
					</EmptyState.Content>
				</EmptyState.Root>
			</VStack>
		);
	}

	return (
		<VStack align="stretch">
			<CreateProjectDialog repository={selectedRepository} />
			<Separator />
			<VStack align="stretch">
				{Object.entries(projects[selectedRepository]).map(([k, v]) => (
					<ProjectSelectItem
						key={k}
						repository={selectedRepository}
						projectKey={k}
						project={v}
						selected={!!selectedProject && selectedProject.name === k}
						onSelect={onSelectProject}
					/>
				))}
			</VStack>
		</VStack>
	);
}
