import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { createRuler, ic10, ic10Snippets, lineClassController, zeroLineNumbers } from "codemirror-lang-ic10";
import type { Chip, ChipSchema, EnvSchema } from "ic10";
import { useCallback, useEffect, useRef, useState } from "react";
import { parse, stringify } from "yaml";
import { useIc10Store } from "@/stores/ic10Store";

type Ic10CodeProps = {
	chip: Chip;
};
type Timeout = ReturnType<typeof setTimeout>;
const [ruler] = createRuler(90, "ruler");

export function Ic10Code(props: Ic10CodeProps) {
	const { chip } = props;
	const runner = chip!.housing!.runner!;
	const updateCounter = useIc10Store((state) => state.updateCounter); // Добавьте это

	const [line, setLine] = useState(runner.realContext.currentLinePosition + 1);
	const [cmLine] = useState(new lineClassController("nextRunLine"));
	const [code, setCode] = useState(runner.realContext.housing.chip?.getIc10Code() || "");

	const { initialEnv, setInitialEnv } = useIc10Store();

	const debounceTimerRef = useRef<Timeout | null>(null);
	useEffect(() => {
		cmLine.highlightLine(line);
	});
	// Обновляем код при изменении updateCounter
	useEffect(() => {
		const newCode = runner.realContext.housing.chip?.getIc10Code() || "";
		setCode(newCode);
		const pos = runner.realContext.currentLinePosition;
		setLine(pos !== undefined ? pos + 1 : 1);
	}, [updateCounter, runner]);

	const updateCode = useCallback(
		(newCode: string) => {
			setCode(newCode); // Обновляем локальное состояние сразу

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				const yaml = parse(initialEnv) as EnvSchema;
				yaml.chips = yaml.chips.map((c: ChipSchema) => {
					if (c.id === chip.id) {
						c.code = newCode;
					}
					return c;
				});
				setInitialEnv(stringify(yaml));
			}, 500);
		},
		[initialEnv, chip.id, setInitialEnv],
	);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	return (
		<CodeMirror
			key={`editor-${chip.id}-${updateCounter}`} // Добавьте key для принудительного обновления
			value={code}
			onChange={updateCode}
			height={"580px"}
			theme={vscodeDark}
			extensions={[ic10(), EditorView.lineWrapping, zeroLineNumbers, cmLine.extension, ic10Snippets(), ruler]}
		/>
	);
}

export default Ic10Code;
