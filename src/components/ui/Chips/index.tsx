import { Tabs } from "@chakra-ui/react";
import type { Chip } from "ic10";
import { LuTerminal } from "react-icons/lu";
import Ic10Code from "@/components/ui/Ic10Code";
import { useIc10Store } from "@/stores/ic10Store";

type RunnersProps = {
	chips: Chip[];
};

export function Chips(props: RunnersProps) {
	const { chips } = props;
	const updateCounter = useIc10Store((state) => state.updateCounter);

	return (
		<Tabs.Root defaultValue="1">
			<Tabs.List>
				{chips.map((chip) => (
					<Tabs.Trigger key={`${chip.id}-${updateCounter}`} value={chip.id.toString()}>
						<LuTerminal />
						{chip.id}
						{/* <Kbd>{chip.getRunner()?.realContext?.currentLinePosition ?? 0}</Kbd> */}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			{chips.map((chip) => (
				<Tabs.Content key={chip.id} value={chip.id.toString()} minH={"500px"}>
					<Ic10Code chip={chip} />
				</Tabs.Content>
			))}
		</Tabs.Root>
	);
}

export default Chips;
