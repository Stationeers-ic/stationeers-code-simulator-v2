import { Tabs } from "@chakra-ui/react";
import type { ChipSchema } from "@stationeers-ic/ic10";
import ChipEditor from "./Editor";

type TabsProps = {
	chips: ChipSchema[];
};
export function ChipTabsContent({ chips }: TabsProps) {
	return (
		<>
			{chips.map((chip) => (
				<Tabs.Content key={chip.id} value={chip.id.toString()} height={"410px"}>
					<ChipEditor chip={chip} />
				</Tabs.Content>
			))}
		</>
	);
}

export default ChipTabsContent;
