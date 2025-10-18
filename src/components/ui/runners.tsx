// components/ui/runners.tsx
import { Tabs } from "@chakra-ui/react";
import type { Ic10Runner } from "ic10";
import { LuTerminal } from "react-icons/lu";
import Ic10Code from "./Ic10Code";

type RunnersProps = {
	runners: Map<number, Ic10Runner>;
	update: () => void;
};

export function Runners(props: RunnersProps) {
	const { runners, update } = props;
	const runnersArray = Array.from(runners.entries());

	return (
		<Tabs.Root defaultValue="1">
			<Tabs.List>
				{runnersArray.map(([key]) => (
					<Tabs.Trigger key={key} value={key.toString()}>
						<LuTerminal />
						{key}
					</Tabs.Trigger>
				))}
			</Tabs.List>
			{runnersArray.map(([key, runner]) => (
				<Tabs.Content key={key} value={key.toString()}>
					<Ic10Code runner={runner} update={update} />
				</Tabs.Content>
			))}
		</Tabs.Root>
	);
}

export default Runners;