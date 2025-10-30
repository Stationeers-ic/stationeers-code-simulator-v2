import { Box, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import type { RepoItem } from "@/core/repositories/Repo.class";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import type { RepositoryKey } from "@/stores/projects";

interface ProjectSelectItemProps {
	repository: RepositoryKey;
	projectKey: string;
	selected: boolean;
	project: RepoItem;
	onSelect: (repository: RepositoryKey, project: string) => void;
}

export function ProjectSelectItem({ repository, projectKey, selected, onSelect }: ProjectSelectItemProps) {
	const { hasChange } = useInitialEnvStore();
	const { t } = useTranslation();

	const handleClick = () => {
		if (selected) {
			return;
		}
		onSelect(repository, projectKey);
	};

	const buttonContent = (
		<>
			{projectKey}
			{selected && hasChange && (
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

	if (!selected && hasChange) {
		return (
			<ConfirmButton
				onConfirm={handleClick}
				confirmMessage={t("project.unsavedChangesWarning")}
				confirmButtonText={t("common.continue")}
				cancelButtonText={t("common.cancel")}
			>
				<Button variant="ghost" cursor="pointer">
					{projectKey}
				</Button>
			</ConfirmButton>
		);
	}

	return (
		<Button
			variant={selected ? "surface" : "ghost"}
			position="relative"
			cursor={selected ? "default" : "pointer"}
			onClick={handleClick}
		>
			{buttonContent}
		</Button>
	);
}

export default ProjectSelectItem;
