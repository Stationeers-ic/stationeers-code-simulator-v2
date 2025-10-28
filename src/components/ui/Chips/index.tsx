import { Tabs, VStack, Box } from "@chakra-ui/react";
import ChipTabs from "@/components/ui/Chips/tabs";
import ChipTabsContent from "@/components/ui/Chips/tabsContent";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import ChipActions from "./ChipActions";

export function Chips() {
	const { chips } = useInitialEnvStore();

	return (
		<VStack align="stretch">
			<ChipActions />
			<Tabs.Root defaultValue="1">
				<Tabs.List>
					<ChipTabs chips={chips} />
				</Tabs.List>
				<ChipTabsContent chips={chips} />
			</Tabs.Root>
		</VStack>
	);
}

export default Chips;
