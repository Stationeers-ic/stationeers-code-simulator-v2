import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { yaml } from "@codemirror/lang-yaml";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import type { Ic10Runner } from "ic10";
import { useState } from "react";
import Runners from "./components/ui/runners";
import useIc10 from "./hooks/Builder";

function App() {
  const height = "590px";
  const terminalHeight = "200px";
  const [intiEnv, setIntiEnv] = useState(`

version: 1
chips:
  - id: 1
    code: |
      s db:0 Channel4 15
  - id: 2
    code: |
      yield
      l r1 db:0 Channel4


devices:
  - id: 1
    PrefabName: StructureCircuitHousingCompact
    chip: 1
    ports:
      - port: default
        network: base
  - id: 2
    PrefabName: StructureCircuitHousingCompact
    chip: 2
    ports:
      - port: default
        network: base
networks:
  - id: base
    type: data
    `);
  const [runners, setRunners] = useState<Map<number, Ic10Runner> | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const addToTerminal = (message: string) => {
    setTerminalOutput((prev) => [...prev, `> ${message}`]);
  };
  const { currentEnv, step, init, loading, initialized, getCurrentEnv } =
    useIc10({
      printMessage: addToTerminal,
      getRunners: (runners) => {
        setRunners(runners);
      },
    });

  const load = () => {
    init(intiEnv);
    clearTerminal();
  };

  const update = () => {
    const yaml = getCurrentEnv();
    if (yaml) {
      setIntiEnv(yaml);
      init(yaml);
      clearTerminal();
    }
  };

  const handleStep = () => {
    step();
  };

  const clearTerminal = () => {
    setTerminalOutput([]);
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
                  onClick={handleStep}
                  disabled={!initialized}
                  colorScheme="blue"
                >
                  Step
                </Button>
              </HStack>
            </HStack>
            <Box
              flex={1}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
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
            <Box
              flex={1}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
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
                  onClick={handleStep}
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
            <Box
              flex={1}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              <CodeMirror
                value={intiEnv}
                onChange={setIntiEnv}
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
            <Text color="gray.400">
              No output yet. Execute steps to see output...
            </Text>
          ) : (
            terminalOutput.map((line) => (
              <Text key={line} fontSize="sm">
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
