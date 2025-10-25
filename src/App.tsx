// App.tsx
import { Box, Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useTranslation } from "react-i18next";
import { TopMenu } from "@/components/layout/TopMenu";
import Chips from "@/components/ui/Chips";
import { InitialEnvironmentEditor } from "@/components/ui/InitialEnvironmentEditor";
import { Terminal } from "@/components/ui/Terminal";
import { useIc10Store } from "@/stores/ic10Store";

function App() {
	const { t } = useTranslation();
	// Получаем состояние и действия из хранилища
	const { currentEnv } = useIc10Store();

	return (
		<Box>
			<TopMenu />
			<Box p={3}>
				<Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
					{/* IC10 Code Editor */}
					<GridItem colSpan={2}>
						<VStack align="stretch" height="100%">
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
								<Chips />
							</Box>
						</VStack>
					</GridItem>

					{/* Current Environment */}
					<GridItem colSpan={1}>
						<VStack align="stretch" height="100%">
							<HStack justify="space-between" minH="32px">
								<Text fontWeight="bold">{t("app.currentEnvironment")}</Text>
								<Box width="47px" height={35} />
							</HStack>
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md" minH={"500px"}>
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

					{/* Initial Environment */}
					<GridItem colSpan={1}>
						<InitialEnvironmentEditor />
					</GridItem>
				</Grid>

				{/* Terminal Output */}
				<Terminal />
			</Box>
		</Box>
	);
}

export default App;
