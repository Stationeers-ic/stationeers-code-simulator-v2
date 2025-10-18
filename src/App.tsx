// App.tsx
import { Box, Button, Grid, GridItem, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { yaml } from "@codemirror/lang-yaml";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import Runners from "./components/ui/runners";
import { useIc10Store } from "./stores/ic10Store";

function App() {
	const height = "590px";
	const terminalHeight = "200px";

	// Получаем состояние и действия из хранилища
	const {
		initialEnv,
		currentEnv,
		terminalOutput,
		runners,
		loading,
		initialized,
		setInitialEnv,
		initializeFromYaml,
		step,
		getCurrentEnv,
		clearTerminal
	} = useIc10Store();

	const load = () => {
		initializeFromYaml(initialEnv);
		clearTerminal();
	};

	const update = () => {
		const yaml = getCurrentEnv();
		if (yaml) {
			setInitialEnv(yaml);
			initializeFromYaml(yaml);
			clearTerminal();
		}
	};

	return (
		<Box p={4}>
			<Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
				{/* IC10 Code Editor */}
				<GridItem colSpan={2}>
					<VStack align="stretch" height="100%">
						<HStack justify="space-between">
							<Text fontWeight="bold">IC10 Code</Text>
							<HStack>
								<Text fontSize="sm" color="gray.500">
									Line: {0}
								</Text>
								<Button
									size="sm"
									onClick={step}
									disabled={!initialized}
									colorScheme="blue"
								>
									Step
								</Button>
							</HStack>
						</HStack>
						<Box flex={1} border="1px solid" borderColor="gray.200" borderRadius="md">
							{runners ? <Runners runners={runners} update={update} /> : null}
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
						<Box flex={1} border="1px solid" borderColor="gray.200" borderRadius="md">
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
							<HStack>
								{loading && <Spinner size="sm" />}
								<Button
									size="sm"
									onClick={step}
									disabled={!initialized}
									colorScheme="blue"
								>
									Step
								</Button>
								<Button size="sm" onClick={load} colorScheme="green">
									Initialize
								</Button>
							</HStack>
						</HStack>
						<Box flex={1} border="1px solid" borderColor="gray.200" borderRadius="md">
							<CodeMirror
								value={initialEnv}
								onChange={setInitialEnv}
								height={height}
								theme={vscodeDark}
								extensions={[yaml()]}
							/>
						</Box>
					</VStack>
				</GridItem>
			</Grid>

			{/* Terminal Output */}
			<VStack align="stretch">
				<HStack justify="space-between">
					<Text fontWeight="bold">Terminal Output</Text>
					<Button size="sm" onClick={clearTerminal} colorScheme="gray">
						Clear
					</Button>
				</HStack>
				<Box
					height={terminalHeight}
					border="1px solid"
					borderColor="gray.200"
					borderRadius="md"
					bg="black"
					color="white"
					fontFamily="monospace"
					p={3}
					overflow="auto"
				>
					{terminalOutput.length === 0 ? (
						<Text color="gray.400">No output yet. Execute steps to see output...</Text>
					) : (
						terminalOutput.map((line, index) => (
							<Text key={index} fontSize="sm">
								{line}
							</Text>
						))
					)}
				</Box>
			</VStack>
		</Box>
	);
}

export default App;