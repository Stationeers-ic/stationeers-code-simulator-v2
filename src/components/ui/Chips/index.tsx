import { Box, Tabs, VStack } from "@chakra-ui/react";
import ChipTabs from "@/components/ui/Chips/tabs";
import ChipTabsContent from "@/components/ui/Chips/tabsContent";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import ChipActions from "./ChipActions";

export function Chips() {
	const { chips } = useInitialEnvStore();

	return (
		<VStack align="stretch">
			<ChipActions />
			<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
				<Tabs.Root defaultValue="1" orientation="vertical">
					<Tabs.List>
						<ChipTabs chips={chips} />
					</Tabs.List>
					<ChipTabsContent chips={chips} />
				</Tabs.Root>
			</Box>
		</VStack>
	);
}

export default Chips;
