import { Tabs } from "@chakra-ui/react";
import type { ChipSchema } from "ic10";
import ChipEditor from "./Editor";

type TabsProps = {
	chips: ChipSchema[];
};
export function ChipTabsContent({ chips }: TabsProps) {
	return (
		<>
			{chips.map((chip) => (
				<Tabs.Content key={chip.id} value={chip.id.toString()} minH={"500px"}>
					<ChipEditor chip={chip} />
				</Tabs.Content>
			))}
		</>
	);
}

export default ChipTabsContent;
