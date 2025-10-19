// components/ui/Ic10Code.tsx

import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { createRuler, ic10, ic10Snippets, lineClassController, zeroLineNumbers } from "codemirror-lang-ic10";
import type { Chip, ChipSchema, EnvSchema } from "ic10";
import { useEffect, useState } from "react";
import { parse, stringify } from "yaml";
import { useIc10Store } from "@/stores/ic10Store";

type Ic10CodeProps = {
	chip: Chip;
	chipId: number;
};

const [ruler] = createRuler(90, "ruler");
export function Ic10Code(props: Ic10CodeProps) {
	const { chip } = props;
	const runner = chip!.housing!.runner!;
	const [line, setLine] = useState(1);
	const [cmLine] = useState(new lineClassController("nextRunLine"));
	const [code, _setCode] = useState(runner.realContext.housing.chip?.getIc10Code());

	const { initialEnv, setInitialEnv } = useIc10Store();

	const updateCode = (newCode: string) => {
		const yaml = parse(initialEnv) as EnvSchema;
		yaml.chips = yaml.chips.map((c: ChipSchema) => {
			if (c.id === chip.id) {
				c.code = newCode;
			}
			return c;
		});
		setInitialEnv(stringify(yaml));
	};
	useEffect(() => {
		setLine(1);
	}, [runner]);
	useEffect(() => {
		// Обработчик события
		const onStep = () => {
			const pos = runner.realContext.currentLinePosition;
			console.log(pos);
			if (pos !== undefined) {
				setLine(pos + 1);
			}
		};
		const reset = () => {
			setLine(1);
		};
		// Навешиваем обработчик
		runner.on("stepEnd", onStep);
		runner.on("reset", reset);

		// Снимаем обработчик при размонтировании или смене runner
		return () => {
			runner.off("stepEnd", onStep);
			runner.off("reset", reset);
		};
	}, [runner]);

	useEffect(() => {
		console.log(line);
		if (line) cmLine.highlightLine(line);
	}, [line]);

	return (
		<div className="ic10-code-editor">
			<CodeMirror
				value={code}
				onChange={updateCode}
				height={"580px"}
				theme={vscodeDark}
				extensions={[ic10(), EditorView.lineWrapping, zeroLineNumbers, cmLine.extension, ic10Snippets(), ruler]}
			/>
		</div>
	);
}

export default Ic10Code;
