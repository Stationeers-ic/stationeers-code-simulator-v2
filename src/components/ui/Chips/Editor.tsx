import { Editor } from "@monaco-editor/react";
import type { ChipSchema } from "ic10";
import { useInitIc10 } from "@/components/hooks/initIc10";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

type ChipEditorProps = {
	chip: ChipSchema;
};

export function ChipEditor({ chip }: ChipEditorProps) {
	const { setChipCode } = useInitialEnvStore();
	const { init } = useInitIc10();
	const onChange = (value?: string) => {
		if (value) {
			setChipCode(chip.id, value);
			init();
		}
	};

	return (
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
	);
}
export default ChipEditor;
