// components/ui/TopMenu.tsx
import { Box, Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuPlay, LuRedo } from "react-icons/lu";
import Docs from "@/components/layout/Docs";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useIc10Store } from "@/stores/ic10Store";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useTerminalStore } from "@/stores/terminalStore";

export function TopMenu() {
	const { t } = useTranslation();
	const { initialized, step, initializeFromYaml } = useIc10Store();
	const { initialEnv } = useInitialEnvStore();
	const { clearTerminal } = useTerminalStore();
	function init() {
		initializeFromYaml(initialEnv);
		clearTerminal();
	}

	return (
		<Box bg="gray.800" px={4} py={3} borderBottom="1px solid" borderColor="gray.700">
			<HStack justify="space-between">
				<HStack gap={3}>
					<Button size="sm" onClick={step} disabled={!initialized} colorScheme="blue">
						<LuPlay />
						{t("menu.step")}
					</Button>
					<Button size="sm" onClick={init} colorScheme="green">
						<LuRedo />
						{t("menu.initialize")}
					</Button>
					<Docs />
				</HStack>

				<LanguageSelector />
			</HStack>
		</Box>
	);
}
