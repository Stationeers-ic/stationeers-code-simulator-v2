// App.tsx
import { Box, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import Chips from "@/components/ui/Chips";
import { InitialEnvironmentEditor } from "@/components/ui/InitialEnvironmentEditor";
import { Terminal } from "@/components/ui/Terminal";
import { useIc10Store } from "@/stores/ic10Store";

export const Route = createFileRoute("/")({
	component: Index,
});

export function Index() {
	const { t } = useTranslation();
	// Получаем состояние и действия из хранилища
	const { currentEnv } = useIc10Store();

	return (
		<VStack align="stretch" height="100%" className="test2">
			<Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6} height="100%">
				{/* IC10 Code Editor */}
				<GridItem colSpan={2}>
					<VStack align="stretch">
						<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
							<Chips />
						</Box>
					</VStack>
				</GridItem>
				<GridItem colSpan={1}>
					<VStack align="stretch" height="100%">
						<HStack justify="space-between" minH="32px">
							<Text fontWeight="bold">{t("app.currentEnvironment")}</Text>
							<Box width="47px" height={35} />
						</HStack>
						<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
							<Editor
								height={"100%"}
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
				<GridItem colSpan={1}>
					<InitialEnvironmentEditor />
				</GridItem>
			</Grid>
			<Terminal />
		</VStack>
	);
}

export default Index;
