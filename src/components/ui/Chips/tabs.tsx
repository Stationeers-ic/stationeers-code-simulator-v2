import { Kbd, Tabs } from "@chakra-ui/react";
import { LuTerminal } from "react-icons/lu";
import { useIc10Store } from "@/stores/ic10Store";

type TabsProps = {
	chips: number[];
};
export function ChipTabs({ chips }: TabsProps) {
	const { builder } = useIc10Store();
	return (
		<>
			{chips.map((chip) => (
				<Tabs.Trigger key={chip} value={chip.toString()}>
					<LuTerminal />
					{chip}
					<Kbd>{builder?.Chips.get(chip)?.getRunner()?.realContext?.currentLinePosition ?? 0}</Kbd>
				</Tabs.Trigger>
			))}
		</>
	);
}

export default ChipTabs;
