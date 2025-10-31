import { Button, CloseButton, Dialog, HStack } from "@chakra-ui/react";
import { EnvSchema } from "@stationeers-ic/ic10";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as v from "valibot";
import { toaster } from "@/components/chakra/toaster";
import { ProjectForm, type ProjectFormRef } from "@/components/ui/projects/ProjectForm";
import { RepoItem } from "@/core/repositories/Repo.class";
import { string2Json } from "@/helpers";
import { type RepositoryKey, useProjectStore } from "@/stores/projects";

interface CreateProjectDialogProps {
	repository: RepositoryKey;
}

export function CreateProjectDialog({ repository }: CreateProjectDialogProps) {
	const { t } = useTranslation();
	const { getRepository, setSelectedProject, getRepositoryProjects } = useProjectStore();
	const formRef = useRef<ProjectFormRef>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isloading, setIsloading] = useState(false);

	const handleSubmit = async (): Promise<void> => {
		if (!formRef.current) return;

		// Валидация формы
		if (!formRef.current.validateForm()) {
			return;
		}

		const formData = formRef.current.getFormData();
		if (!formData) return;

		try {
			setIsloading(true);
			const exiestingProjects = getRepositoryProjects(repository);
			if (exiestingProjects && Object.keys(exiestingProjects).includes(formData.name)) {
				toaster.create({
					title: t("project.create.error.exist_name", { name: formData.name, repository }),
					description: t("project.create.error.exist_name_description"),
					type: "error",
					duration: 5000,
				});
				return;
			}
			// Парсинг и валидация окружения
			const env = v.safeParse(EnvSchema, string2Json(formData.env));

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
				const repo = getRepository(repository);
				if (!repo) {
					toaster.create({
						title: t("project.create.error.no_repository"),
						description: t("project.create.error.no_repository_description"),
						type: "error",
						duration: 5000,
					});
					return;
				}
				const item = new RepoItem(repo.repoName, formData.name, env.output);
				await repo.save(item);
				setSelectedProject(repository, formData.name);

				toaster.create({
					title: t("project.create.success.title"),
					description: t("project.create.success.description"),
					type: "success",
					duration: 3000,
				});
				setIsOpen(false);
			} catch (saveError) {
				toaster.create({
					title: t("project.create.save_error.title"),
					description: t("project.create.save_error.description"),
					type: "error",
					duration: 5000,
				});
				console.error(saveError);
			}
		} catch (e) {
			toaster.create({
				title: t("project.create.unknown_error.title"),
				description: t("project.create.unknown_error.description"),
				type: "error",
				duration: 5000,
			});
			console.error(e);
		} finally {
			setIsloading(false);
		}
	};

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={(details) => setIsOpen(details.open)}
			size="xl"
			closeOnInteractOutside={false}
		>
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
						<ProjectForm ref={formRef} />
					</Dialog.Body>

					<Dialog.Footer>
						<HStack gap={3} justify="flex-end" pt={4} w="full">
							<Button loading={isloading} onClick={handleSubmit} colorPalette="blue" size="md" px={8}>
								{t("projectForm.actions.submit")}
							</Button>
						</HStack>
					</Dialog.Footer>

					<Dialog.CloseTrigger asChild>
						<CloseButton size="sm" />
					</Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}

export default CreateProjectDialog;
