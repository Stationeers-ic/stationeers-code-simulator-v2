import { Button, CloseButton, Dialog, useDialog } from "@chakra-ui/react";
import { ProjectForm, type ProjectFormData } from "@/components/ui/projects/ProjectForm";
import type { RepositoryKey } from "@/stores/projects";
import { useTranslation } from "react-i18next";

interface CreateProjectDialogProps {
	repository: RepositoryKey;
}

export function CreateProjectDialog({ repository }: CreateProjectDialogProps) {
	const { t } = useTranslation();
	const dialog = useDialog();

	const onCancel = () => {
		dialog.getCloseTriggerProps().onClick;
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
						<ProjectForm
							onSubmit={(data: ProjectFormData): void => {
								throw new Error("Function not implemented.");
							}}
							onCancel={onCancel}
						/>
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
