import { Editor } from "@monaco-editor/react";
import type { ChipSchema } from "ic10";
import { useInitIc10 } from "@/components/hooks/initIc10";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

type ChipEditorProps = {
	chip: ChipSchema;
};

import * as monaco from "monaco-editor";

// Create a decorations collection (new preferred API)

// Function to update dynamic highlight

export function ChipEditor({ chip }: ChipEditorProps) {
	const { setChipCode } = useInitialEnvStore();
	const { init } = useInitIc10();
	const onChange = (value?: string) => {
		if (value) {
			setChipCode(chip.id, value);
			init();
		}
	};

	const plugin = (editor: monaco.editor.IStandaloneCodeEditor) => {
		console.log(editor);
		const decorations = editor.createDecorationsCollection([]);
		function highlightLine(lineNumber: number) {
			decorations.set([
				{
					range: new monaco.Range(lineNumber, 1, lineNumber, 1),
					options: {
						isWholeLine: true,
						className: "highlightedLine",
					},
				},
			]);
		}

		// Change dynamically on cursor move
		editor.onDidChangeCursorPosition((event) => {
			highlightLine(event.position.lineNumber);
		});
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
			onMount={plugin}
		/>
	);
}
export default ChipEditor;
