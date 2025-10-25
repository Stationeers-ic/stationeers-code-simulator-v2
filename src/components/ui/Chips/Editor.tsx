import { Editor } from "@monaco-editor/react";
import type { ChipSchema } from "@stationeers-ic/ic10";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { useInitIc10 } from "@/components/hooks/initIc10";
import { useIc10Store } from "@/stores/ic10Store";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

type ChipEditorProps = {
	chip: ChipSchema;
};

export function ChipEditor({ chip }: ChipEditorProps) {
	const getRealContextByChipId = useIc10Store((state) => state.getRealContextByChipId);
	const { setChipCode } = useInitialEnvStore();
	const { init } = useInitIc10();

	// Refs для хранения состояния
	const decorationsRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);
	const intervalRef = useRef<number | null>(null);
	const lastHighlightRef = useRef<{ current: number; future: number }>({ current: -1, future: -1 });

	const onChange = (value?: string) => {
		if (value) {
			setChipCode(chip.id, value);
			init();
		}
	};

	const plugin = (editor: monaco.editor.IStandaloneCodeEditor) => {
		// Создаём коллекцию декораций один раз
		decorationsRef.current = editor.createDecorationsCollection([]);

		const highlightLine = (currentLine: number, futureLine: number) => {
			// Оптимизация: не обновляем, если линии не изменились
			if (lastHighlightRef.current.current === currentLine && lastHighlightRef.current.future === futureLine) {
				return;
			}

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
		};

		// Используем requestAnimationFrame вместо setInterval для лучшей производительности
		const updateHighlight = () => {
			const realContext = getRealContextByChipId(chip.id);
			if (realContext) {
				highlightLine(realContext.currentLinePosition, realContext.getNextLineIndex());
			}
			intervalRef.current = setTimeout(() => {
				requestAnimationFrame(updateHighlight);
			}, 300);
		};

		updateHighlight();
	};

	// Очистка при размонтировании
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearTimeout(intervalRef.current);
			}
			decorationsRef.current?.clear();
		};
	}, []);

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
					return `${lineNumber - 1}`;
				},
			}}
			onMount={plugin}
		/>
	);
}

export default ChipEditor;
