import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { ic10 } from "codemirror-lang-ic10";
import { yaml } from "@codemirror/lang-yaml";
import { Box, Button, Grid, GridItem, Spinner, VStack, HStack, Text } from "@chakra-ui/react"
import useIc10 from "./hooks/Builder";
import { useState } from 'react';
import type { Ic10Runner } from 'ic10';

function App() {
  const height = "590px"
  const terminalHeight = "200px"
  const [intiEnv, setIntiEnv] = useState(`
version: 1
chips:
  - id: 1
    code: |
      move r0 0
      loop:
      add r0 r0 1
      j loop

devices:
  - id: 1
    PrefabName: StructureCircuitHousingCompact
    name: MyDevice
    chip: 1
    ports:
      - port: default
        network: base
networks:
  - id: base
    type: data
    `);
  const [ic10Code, setIc10] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_runners, setRunners] = useState<Map<number, Ic10Runner> | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const addToTerminal = (message: string) => {
    setTerminalOutput(prev => [...prev, `> ${message}`])
  }
  const { currentEnv, step, init, loading, initialized } = useIc10({
    printMessage: addToTerminal,
    getRunners: (runners) => {
      setRunners(runners)
    }
  })

  const Load = () => {
    init(intiEnv)
    clearTerminal()
  }



  const handleStep = () => {
    step()
  }

  const clearTerminal = () => {
    setTerminalOutput([])
  }
  return (
    <Box p={4}>
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
        {/* IC10 Code Editor */}
        <GridItem colSpan={2}>
          <VStack align="stretch" height="100%">
            <HStack justify="space-between">
              <Text fontWeight="bold">IC10 Code</Text>
              <HStack>
                <Text fontSize="sm" color="gray.500">Line: {0}</Text>
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
            <Box flex={1} border="1px solid" borderColor="gray.200" borderRadius="md">
              <CodeMirror
                value={ic10Code}
                onChange={setIc10}
                height={height}
                theme={vscodeDark}
                extensions={[ic10()]}
              />
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
                  onClick={handleStep}
                  disabled={!initialized}
                  colorScheme="blue"
                >
                  Step
                </Button>
                <Button
                  size="sm"
                  onClick={Load}
                  colorScheme="green"
                >
                  Initialize
                </Button>
              </HStack>
            </HStack>
            <Box flex={1} border="1px solid" borderColor="gray.200" borderRadius="md">
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
            <Text color="gray.400">No output yet. Execute steps to see output...</Text>
          ) : (
            terminalOutput.map((line, index) => (
              <Text key={index} fontSize="sm">{line}</Text>
            ))
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default App;