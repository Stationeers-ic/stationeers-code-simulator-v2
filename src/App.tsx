// App.tsx
import { Box, Grid, GridItem, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { yaml } from "@codemirror/lang-yaml";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import type { JSONSchemaType } from "ajv";
import { use } from "react";
import Chips from "./components/ui/Chips";
import { Terminal } from "./components/ui/Terminal";
import { TopMenu } from "./components/ui/TopMenu";
import YamlEditorWithValidation from "./components/ui/YamlEditorWithValidation";
import { fetchData } from "./stores/data";
import { useIc10Store } from "./stores/ic10Store";
import { useTerminalStore } from "./stores/terminalStore";

function App() {
	const schema = use<JSONSchemaType<any>>(
		fetchData("https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json"),
	);
	const height = "590px";
	const { clearTerminal } = useTerminalStore();
	// Получаем состояние и действия из хранилища
	const { initialEnv, currentEnv, chips, loading, initialized, setInitialEnv, initializeFromYaml, step } =
		useIc10Store();

	const load = () => {
		clearTerminal();
		initializeFromYaml(initialEnv);
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
								<Text fontWeight="bold">Current Environment</Text>
								<Box width="47px" height={35} />
							</HStack>
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
								<CodeMirror
									value={currentEnv}
									readOnly={true}
									height={height}
									theme={vscodeDark}
									extensions={[yaml()]}
								/>
							</Box>
						</VStack>
					</GridItem>

					{/* Initial Environment */}
					<GridItem colSpan={1}>
						<VStack align="stretch" height="100%">
							<HStack justify="space-between">
								<Text fontWeight="bold">Initial Environment</Text>
								{loading && <Spinner size="sm" />}
							</HStack>
							<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
								<YamlEditorWithValidation
									value={initialEnv}
									onChange={setInitialEnv}
									codeMirrorProps={{
										theme: vscodeDark,
										height,
									}}
									schema={schema}
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
