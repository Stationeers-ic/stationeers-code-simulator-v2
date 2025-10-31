// components/ChipEditor.tsx
import type { ChipSchema } from "@stationeers-ic/ic10";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { BaseEditor } from "@/components/BaseEditor";
import { useInitIc10 } from "@/components/hooks/initIc10";
import signal from "@/Signal";
import { useIc10Store } from "@/stores/ic10Store";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

type ChipEditorProps = {
	chip: ChipSchema;
};

export function ChipEditor({ chip }: ChipEditorProps) {
	const getRealContextByChipId = useIc10Store((state) => state.getRealContextByChipId);
	const { setChipCode } = useInitialEnvStore();
	const { init } = useInitIc10();

	const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
	const lastHighlightRef = useRef<{ current: number; future: number }>({ current: -1, future: -1 });
	const unsubscribeRef = useRef<(() => void) | null>(null);

	const onChange = (value?: string) => {
		if (value) {
			setChipCode(chip.id, value);
			init();
		}
	};

	const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
		decorationsRef.current = editor.createDecorationsCollection([]);

		const highlightLine = (currentLine: number, futureLine: number) => {
			if (lastHighlightRef.current.current === currentLine && lastHighlightRef.current.future === futureLine) {
				return;
			}
			try {
				lastHighlightRef.current = { current: currentLine, future: futureLine };

				const adjustedCurrent = currentLine + 1;
				const adjustedFuture = futureLine + 1;

				decorationsRef.current?.set([
					{
						range: new monaco.Range(adjustedCurrent, 1, adjustedCurrent, 1),
						options: {
							isWholeLine: true,
							className: "currentLine",
						},
					},
					{
						range: new monaco.Range(adjustedFuture, 1, adjustedFuture, 1),
						options: {
							isWholeLine: true,
							className: "futureLine",
						},
					},
				]);
			} catch (e) {
				console.warn(e);
			}
		};

		const updateHighlight = () => {
			const realContext = getRealContextByChipId(chip.id);
			if (realContext) {
				highlightLine(realContext.currentLinePosition, realContext.getNextLineIndex());
			}
		};

		const updateHighClear = () => {
			decorationsRef.current?.clear();
			lastHighlightRef.current = { current: 0, future: 0 };
		};

		signal.on("step", updateHighlight);
		signal.on("init", updateHighClear);

		unsubscribeRef.current = () => {
			signal.off("step", updateHighlight);
			signal.off("init", updateHighClear);
		};

		updateHighlight();
	};

	useEffect(() => {
		return () => {
			if (unsubscribeRef.current) {
				unsubscribeRef.current();
				unsubscribeRef.current = null;
			}
			decorationsRef.current?.clear();
		};
	}, []);

	return (
		<BaseEditor
			key={`editor-${chip.id}`}
			value={chip.code}
			language="ic10"
			onChange={onChange}
			onMount={onMount}
			options={{
				lineNumbers(lineNumber: number) {
					return `${lineNumber - 1}`;
				},
			}}
		/>
	);
}

export default ChipEditor;
