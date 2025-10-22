// components/ui/TopMenu.tsx
import { Box, Button, HStack, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

interface TopMenuProps {
	onStep: () => void;
	onInitialize: () => void;
	loading: boolean;
	initialized: boolean;
}

export function TopMenu({ onStep, onInitialize, loading, initialized }: TopMenuProps) {
	const { t } = useTranslation();

	return (
		<Box bg="gray.800" px={4} py={3} borderBottom="1px solid" borderColor="gray.700">
			<HStack justify="space-between">
				<HStack gap={3}>
					<Button size="sm" onClick={onStep} disabled={!initialized} colorScheme="blue">
						{t("menu.step")}
					</Button>
					<Button size="sm" onClick={onInitialize} colorScheme="green">
						{loading && <Spinner size="xs" mr={2} />}
						{t("menu.initialize")}
					</Button>
				</HStack>

				<LanguageSelector />
			</HStack>
		</Box>
	);
}
