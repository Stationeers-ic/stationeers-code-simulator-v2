import { SegmentGroup } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { RepositoryConfig, RepositoryKey } from "@/stores/projects";

interface RepositoryListProps {
	repositories: RepositoryConfig;
	selectedRepository: RepositoryKey | null;
	onSelectRepository: (key: RepositoryKey) => void;
}

export function RepositoryList({ repositories, selectedRepository, onSelectRepository }: RepositoryListProps) {
	const { t } = useTranslation();

	return (
		<SegmentGroup.Root
			w="100%"
			orientation="vertical"
			defaultValue={selectedRepository || undefined}
			onValueChange={(e) => {
				onSelectRepository(e.value as RepositoryKey);
			}}
		>
			<SegmentGroup.Indicator />
			<SegmentGroup.Items
				items={Object.entries(repositories).map(([k, v]) => ({
					label: t(`project.repository.name.${k}`),
					value: k,
					disabled: !v.enable,
				}))}
			/>
		</SegmentGroup.Root>
	);
}
