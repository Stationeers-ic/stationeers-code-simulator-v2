import { ButtonGroup, EmptyState, SegmentGroup } from "@chakra-ui/react";
import CreateProjectDialog from "@/components/ui/projects/CreateProjectDialog";
import type { RepositoryKey } from "@/stores/projects";

interface ProjectListProps {
	selectedRepository: RepositoryKey | null;
	projects: Record<string, Record<string, any>>;
	selectedProject: string | null;
	onSelectProject: (repository: RepositoryKey, project: string) => void;
}

export function ProjectList({ selectedRepository, projects, selectedProject, onSelectProject }: ProjectListProps) {
	const hasProjects =
		selectedRepository &&
		typeof projects[selectedRepository] !== "undefined" &&
		Object.keys(projects[selectedRepository]).length > 0;

	if (!hasProjects) {
		return (
			<EmptyState.Root>
				<EmptyState.Content>
					<EmptyState.Indicator>
						{selectedRepository ? "Проектов не найдено" : "Выберите репозиторий"}
					</EmptyState.Indicator>
					<EmptyState.Title />
					<EmptyState.Description />
					{selectedRepository && (
						<ButtonGroup>
							<CreateProjectDialog repository={selectedRepository} />
						</ButtonGroup>
					)}
				</EmptyState.Content>
			</EmptyState.Root>
		);
	}

	return (
		<>
			<SegmentGroup.Root
				orientation="vertical"
				defaultValue={selectedProject || undefined}
				onValueChange={(e) => {
					if (e.value && selectedRepository) {
						onSelectProject(selectedRepository, e.value);
					}
				}}
			>
				<SegmentGroup.Indicator />
				<SegmentGroup.Items
					items={Object.entries(projects[selectedRepository]).map(([k, _v]) => ({
						label: k,
						value: k,
						disabled: false,
					}))}
				/>
			</SegmentGroup.Root>
			<ButtonGroup mt={4}>
				<CreateProjectDialog repository={selectedRepository} />
			</ButtonGroup>
		</>
	);
}
