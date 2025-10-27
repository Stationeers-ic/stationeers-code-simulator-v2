// components/ui/Terminal.tsx
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import signal from "@/Signal";
import { type TerminalEntry, useTerminalStore } from "@/stores/terminalStore";

export function Terminal() {
	const { t } = useTranslation();
	const terminalHeight = "200px";
	const { clearTerminal, getTerminalOutput } = useTerminalStore();
	const [terminalOutput, setTerminal] = useState<TerminalEntry[]>([])
	useEffect(() => {
		const upd = () => {
			setTerminal(getTerminalOutput())
		}
		signal.on("updateTerminal", upd)
		return () => {
			signal.off("updateTerminal", upd)
		}
	}, [])

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
				{terminalOutput?.length === 0 ? (
					<Text color="gray.400">{t("terminal.noOutput")}</Text>
				) : (
					terminalOutput.map((line, index) => (
						<Text key={index} fontSize="sm">
							{line.content}
						</Text>
					))
				)}
			</Box>
		</VStack>
	);
}
