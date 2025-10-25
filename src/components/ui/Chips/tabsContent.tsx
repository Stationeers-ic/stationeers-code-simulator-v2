import { Tabs } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import type { ChipSchema } from "ic10";

type TabsProps = {
	chips: ChipSchema[];
};
export function ChipTabsContent({ chips }: TabsProps) {
	const onChange = (value?: string) => {
		if (value) {
			console.log(value);
		}
	};

	return (
		<>
			{chips.map((chip) => (
				<Tabs.Content key={chip.id} value={chip.id.toString()} minH={"500px"}>
					<Editor
						height={"500px"}
						theme="ic10"
						key={`editor-${chip.id}`}
						value={chip.code}
						language="ic10"
						onChange={onChange}
						options={{
							minimap: { enabled: false },
							lineNumbers(lineNumber) {
								const newLine = lineNumber - 1;
								return `${newLine}`;
							},
						}}
					/>
				</Tabs.Content>
			))}
		</>
	);
}

export default ChipTabsContent;
