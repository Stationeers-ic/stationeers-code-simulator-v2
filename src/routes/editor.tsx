// App.tsx
import { Box, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BugReportButton } from "@/components/layout/BugReport";
import Chips from "@/components/ui/chips";
import { InitialEnvironmentEditor } from "@/components/ui/InitialEnvironmentEditor";
import { Terminal } from "@/components/ui/Terminal";
import { useIc10Store } from "@/stores/ic10Store";

export const Route = createFileRoute("/editor")({
	component: Index,
});

export function Index() {
	const { t } = useTranslation();
	// Получаем состояние и действия из хранилища
	const { currentEnv } = useIc10Store();

	return (
		<>
			<VStack align="stretch" className="test2">
				<Grid templateColumns="2fr 1fr 1fr" gap={6} mb={6}>
					{/* IC10 Code Editor */}
					<GridItem>
						<Chips />
					</GridItem>
					<GridItem>
						<VStack align="stretch" height={"100%"}>
							<HStack justify="space-between">
								<Text fontWeight="bold">{t("app.currentEnvironment")}</Text>
								<Box width="47px" height={35} />
							</HStack>
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
								<Editor
									value={currentEnv}
									language="json"
									options={{
										minimap: { enabled: false },
										readOnly: true,
									}}
									theme="ic10"
								/>
							</Box>
						</VStack>
					</GridItem>
					<GridItem>
						<InitialEnvironmentEditor />
					</GridItem>
				</Grid>
				<Terminal />
			</VStack>
			<BugReportButton />
		</>
	);
}

export default Index;
