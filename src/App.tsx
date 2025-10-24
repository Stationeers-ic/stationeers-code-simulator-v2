// App.tsx
import { Box, Grid, GridItem, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { JSONSchemaType } from "ajv";
import { use, useRef } from "react";
import { useTranslation } from "react-i18next";
import Chips from "@/components/ui/Chips";
import { Terminal } from "@/components/ui/Terminal";
import { TopMenu } from "@/components/ui/TopMenu";
import { fetchData } from "@/stores/data";
import { useIc10Store } from "@/stores/ic10Store";
import { useTerminalStore } from "@/stores/terminalStore";

function App() {
	const { t } = useTranslation();
	const schema = use<JSONSchemaType<any>>(
		fetchData("https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json"),
	);
	const { clearTerminal } = useTerminalStore();
	const monacoRef = useRef<Monaco | null>(null);

	// Получаем состояние и действия из хранилища
	const { initialEnv, currentEnv, chips, loading, initialized, setInitialEnv, initializeFromYaml, step } =
		useIc10Store();

	const load = () => {
		clearTerminal();
		initializeFromYaml(initialEnv);
	};

	// Функция для настройки Monaco Editor с JSON Schema
	const handleEditorWillMount = (monaco: Monaco) => {
		monacoRef.current = monaco;

		// Настройка JSON Schema для валидации
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
					fileMatch: ["*"], // применяется ко всем JSON файлам
					schema: schema,
				},
			],
		});
	};

	return (
		<Box>
			<TopMenu onStep={step} onInitialize={load} loading={loading} initialized={initialized} />
			<Box p={3}>
				<Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
					{/* IC10 Code Editor */}
					<GridItem colSpan={2}>
						<VStack align="stretch" height="100%">
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
								{chips ? <Chips chips={chips} /> : null}
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
									theme="vs-dark"
									beforeMount={handleEditorWillMount}
								/>
							</Box>
						</VStack>
					</GridItem>

					{/* Initial Environment */}
					<GridItem colSpan={1}>
						<VStack align="stretch" height="100%">
							<HStack justify="space-between">
								<Text fontWeight="bold">{t("app.initialEnvironment")}</Text>
								<Box width="47px" height={35} />
								{loading && <Spinner size="sm" />}
							</HStack>
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md" minH={"500px"}>
								<Editor
									height={"100%"}
									value={initialEnv}
									onChange={(value) => {
										value ? setInitialEnv(value) : null;
									}}
									language="json"
									options={{
										minimap: { enabled: false },
									}}
									theme="vs-dark"
									beforeMount={handleEditorWillMount}
								/>
							</Box>
						</VStack>
					</GridItem>
				</Grid>

				{/* Terminal Output */}
				<Terminal />
			</Box>
		</Box>
	);
}

export default App;
