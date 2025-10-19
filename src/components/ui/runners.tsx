// components/ui/runners.tsx
import { Tabs } from "@chakra-ui/react";
import type { Chip } from "ic10";
import { LuTerminal } from "react-icons/lu";
import Ic10Code from "./Ic10Code";

type RunnersProps = {
	chips: Map<number, Chip>;
};

export function Chips(props: RunnersProps) {
	const { chips: runners } = props;
	const runnersArray = Array.from(runners.entries());

	return (
		<Tabs.Root defaultValue="1">
			<Tabs.List>
				{runnersArray.map(([key]) => (
					<Tabs.Trigger key={key} value={key.toString()}>
						<LuTerminal />
						{key}
						{/* line: {runner?.realContext?.executeLine?.position ?? 0} */}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			{runnersArray.map(([key, chip]) => (
				<Tabs.Content key={key} value={key.toString()}>
					<Ic10Code chip={chip} chipId={key} />
				</Tabs.Content>
			))}
		</Tabs.Root>
	);
}

export default Chips;
