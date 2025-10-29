import { Kbd, Tabs } from "@chakra-ui/react";
import type { ChipSchema } from "@stationeers-ic/ic10";
import { LuTerminal } from "react-icons/lu";
import { useIc10Store } from "@/stores/ic10Store";

type TabsProps = {
	chips: ChipSchema[];
};
export function ChipTabs({ chips }: TabsProps) {
	const { builder } = useIc10Store();
	const updateCounter = useIc10Store((state) => state.updateCounter);
	return (
		<>
			{chips.map((chip) => (
				<Tabs.Trigger key={`${chip.id}-${updateCounter}`} value={chip.id.toString()}>
					<LuTerminal />
					{chip.id}
					<Kbd>
						{(builder?.Chips.get(chip.id)?.getRunner()?.realContext?.currentLinePosition ?? 0)
							.toFixed(0)
							.padStart(3, "0")}
					</Kbd>
				</Tabs.Trigger>
			))}
		</>
	);
}

export default ChipTabs;
