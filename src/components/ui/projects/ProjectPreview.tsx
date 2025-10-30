import { Button, Card, EmptyState, Field, Input, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmButton from "@/components/ui/ConfirmButton";
import type { RepoItem } from "@/core/repositories/Repo.class";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useProjectStore } from "@/stores/projects";

interface ProjectPreviewProps {
	project: RepoItem | null;
}

export function ProjectPreview({ project }: ProjectPreviewProps) {
	const { t } = useTranslation();
	const { hasChange } = useInitialEnvStore();
	const { selectedProject, setSelectedProject } = useProjectStore();
	const [requireConfirm, setRequireConfirm] = useState(false);

	useEffect(() => {
		setRequireConfirm(hasChange && selectedProject !== project);
	}, [hasChange, selectedProject, project]);

	const select = () => {
		if (project) {
			setSelectedProject(project.repo, project.name);
		}
	};

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
		<Card.Root maxW="sm">
			<Card.Header>
				<Card.Title>{project.name}</Card.Title>
				<Card.Description>{project.env.project?.description}</Card.Description>
			</Card.Header>
			<Card.Body>
				{project.env.project ? (
					<Stack gap="4" w="full">
						<Field.Root hidden={!project.env.project?.name}>
							<Field.Label>{t("projectForm.fields.name.label")}</Field.Label>
							<Input readOnly={true} value={project.env.project.name} />
						</Field.Root>
						<Field.Root hidden={!project.env.project?.author}>
							<Field.Label>{t("projectForm.fields.author.label")}</Field.Label>
							<Input readOnly={true} value={project.env.project.author} />
						</Field.Root>
						<Field.Root hidden={!project.env.project?.version}>
							<Field.Label>{t("projectForm.fields.version.label")}</Field.Label>
							<Input readOnly={true} value={project.env.project.version} />
						</Field.Root>
						<Field.Root hidden={!project.env.project?.tags}>
							<Field.Label>{t("projectForm.fields.tags.label")}</Field.Label>
							<Input readOnly={true} value={project.env.project.tags} />
						</Field.Root>
					</Stack>
				) : (
					<></>
				)}
			</Card.Body>
			<Card.Footer justifyContent="flex-end">
				{requireConfirm ? (
					<ConfirmButton
						onConfirm={select}
						confirmMessage={t("project.unsavedChangesWarning")}
						confirmButtonText={t("common.continue")}
						cancelButtonText={t("common.cancel")}
					>
						<Button cursor="pointer">{t("project.run_edit")}</Button>
					</ConfirmButton>
				) : (
					<Button cursor="pointer" onClick={select}>
						{t("project.run_edit")}
					</Button>
				)}
			</Card.Footer>
		</Card.Root>
	);
}
