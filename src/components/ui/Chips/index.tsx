import { Tabs } from "@chakra-ui/react";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import ChipTabs from "./tabs";
import ChipTabsContent from "./tabsContent";

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
