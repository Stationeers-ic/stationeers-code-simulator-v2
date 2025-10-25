import { Tabs } from "@chakra-ui/react";
import ChipTabs from "@/components/ui/Chips/tabs";
import ChipTabsContent from "@/components/ui/Chips/tabsContent";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

export function Chips() {
	const { chips } = useInitialEnvStore();

	return (
		<Tabs.Root defaultValue="1">
			<Tabs.List>
				<ChipTabs chips={chips} />
			</Tabs.List>
			<ChipTabsContent chips={chips} />
		</Tabs.Root>
	);
}

export default Chips;
