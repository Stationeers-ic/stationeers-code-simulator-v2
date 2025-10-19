// components/ui/Ic10Code.tsx

import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { createRuler, ic10, ic10Snippets, lineClassController, zeroLineNumbers } from "codemirror-lang-ic10";
import type { Ic10Runner } from "ic10";
import { useEffect, useState } from "react";

type Ic10CodeProps = {
	runner: Ic10Runner;
	update: () => void;
};

const [ruler] = createRuler(90, "ruler");
export function Ic10Code(props: Ic10CodeProps) {
	const { runner, update } = props;
	const [line, setLine] = useState(0);
	const [cmLine] = useState(new lineClassController("nextRunLine"));
	const [code, _setCode] = useState(runner.realContext.housing.chip?.getIc10Code());

	const updateCode = (newCode: string) => {
		runner.realContext.housing.chip?.setIc10Code(newCode);
		update();
	};

	useEffect(() => {
		// Обработчик события
		const onStep = () => {
			const pos = runner.realContext.currentLinePosition;
			console.log(pos)
			if (pos !== undefined) {
				setLine(pos+1);
			}
		};
		// Навешиваем обработчик
		runner.on("stepEnd", onStep);

		// Снимаем обработчик при размонтировании или смене runner
		return () => {
			runner.off("stepEnd", onStep);
		};
	}, [runner]);

	useEffect(() => {
		console.log(line)
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
