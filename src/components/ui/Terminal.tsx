// components/ui/Terminal.tsx
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useTerminalStore } from "@/stores/terminalStore";
import { useTranslation } from "react-i18next";

export function Terminal() {
	const { t } = useTranslation();
	const terminalHeight = "200px";
	const { terminalOutput, clearTerminal } = useTerminalStore();
	return (
		<VStack align="stretch">
			<HStack justify="space-between">
				<Text fontWeight="bold">{t("terminal.title")}</Text>
				<Button size="sm" onClick={clearTerminal} colorScheme="gray">
					{t("terminal.clear")}
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
					<Text color="gray.400">{t("terminal.noOutput")}</Text>
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
