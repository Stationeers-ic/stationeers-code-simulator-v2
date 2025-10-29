import { Button, CloseButton, Dialog } from "@chakra-ui/react";
import { EnvSchema } from "@stationeers-ic/ic10";
import { useTranslation } from "react-i18next";
import * as v from "valibot";
import { ProjectForm, type ProjectFormData } from "@/components/ui/projects/ProjectForm";
import { type RepositoryKey, useProjectStore } from "@/stores/projects";

interface CreateProjectDialogProps {
	repository: RepositoryKey;
}

export function CreateProjectDialog({ repository }: CreateProjectDialogProps) {
	const { t } = useTranslation();
	const { getSelectedRepository } = useProjectStore();
	const onSubmit = async (data: ProjectFormData): Promise<void> => {
		try {
			const env = v.safeParse(EnvSchema, JSON.parse(data?.env || "{}"));
			if (env.success) {
				try {
					await getSelectedRepository()?.save(env.output);
				} catch (e) {
					// toast: ошибка сохранения проверьте настройки репозитория
				}
			} else {
				// toast вывести ошибки
			}
		} catch (e) {
			//toast: извените что то пошло не так
		}
	};
	return (
		<Dialog.Root size="xl" closeOnInteractOutside={false}>
			<Dialog.Trigger asChild>
				<Button>Create project</Button>
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
