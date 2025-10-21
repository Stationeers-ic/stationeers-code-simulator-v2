import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useTerminalStore } from "@/stores/terminalStore";

export function Terminal() {
	const terminalHeight = "200px";
	const { terminalOutput, clearTerminal } = useTerminalStore();
	return (
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
	);
}
