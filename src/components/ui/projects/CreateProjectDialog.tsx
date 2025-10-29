import { Button, CloseButton, Dialog } from "@chakra-ui/react";
import { EnvSchema } from "@stationeers-ic/ic10";
import JSON5 from "json5";
import { useTranslation } from "react-i18next";
import * as v from "valibot";
import { toaster } from "@/components/chakra/toaster";
import { ProjectForm, type ProjectFormData } from "@/components/ui/projects/ProjectForm";
import { type RepositoryKey, useProjectStore } from "@/stores/projects";

interface CreateProjectDialogProps {
	repository: RepositoryKey;
}

export function CreateProjectDialog({ repository }: CreateProjectDialogProps) {
	const { t } = useTranslation();
	const { getSelectedRepository, setSelectedProject } = useProjectStore();

	const onSubmit = async (data: ProjectFormData): Promise<void> => {
		try {
			// Парсинг и валидация окружения
			const env = v.safeParse(EnvSchema, JSON5.parse(data.env || "{}"));

			if (!env.success) {
				toaster.create({
					title: t("project.create.env_error.title"),
					description: t("project.create.env_error.description"),
					type: "error",
					duration: 5000,
				});
				return;
			}

			try {
				// Сохранение проекта
				await getSelectedRepository()?.save(data.name, env.output);
				setSelectedProject(repository, data.name);

				toaster.create({
					title: t("project.create.success.title"),
					description: t("project.create.success.description"),
					type: "success",
					duration: 3000,
				});
			} catch (saveError) {
				toaster.create({
					title: t("project.create.save_error.title"),
					description: t("project.create.save_error.description"),
					type: "error",
					duration: 5000,
				});
			}
		} catch (e) {
			toaster.create({
				title: t("project.create.unknown_error.title"),
				description: t("project.create.unknown_error.description"),
				type: "error",
				duration: 5000,
			});
		}
	};

	return (
		<Dialog.Root size="xl" closeOnInteractOutside={false}>
			<Dialog.Trigger asChild>
				<Button>{t("project.create.button")}</Button>
			</Dialog.Trigger>

			<Dialog.Backdrop />

			<Dialog.Positioner>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>{t("project.dialog.header", { repository })}</Dialog.Title>
					</Dialog.Header>

					<Dialog.Body>
						<ProjectForm onSubmit={onSubmit} />
					</Dialog.Body>

					<Dialog.CloseTrigger asChild>
						<CloseButton size="sm" />
					</Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}

export default CreateProjectDialog;
