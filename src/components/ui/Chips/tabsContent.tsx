import { Box, Tabs } from "@chakra-ui/react";
import type { ChipSchema } from "ic10";
import ChipEditor from "./Editor";
import Marker from "./Marker";

type TabsProps = {
	chips: ChipSchema[];
};
export function ChipTabsContent({ chips }: TabsProps) {
	return (
		<>
			{chips.map((chip) => (
				<Tabs.Content key={chip.id} value={chip.id.toString()} minH={"500px"}>
					<Box position={"relative"} height={"100%"} width={"100%"}>
						{/* <Marker chip={chip} /> */}
						<ChipEditor chip={chip} />
					</Box>
				</Tabs.Content>
			))}
		</>
	);
}

export default ChipTabsContent;
