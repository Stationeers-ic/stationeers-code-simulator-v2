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

const cmLine = new lineClassController("nextRunLine");
const [ruler] = createRuler(90, "ruler");
export function Ic10Code(props: Ic10CodeProps) {
	const { runner, update } = props;
	const [line, setLine] = useState(0);
	const [code, _setCode] = useState(runner.realContext.housing.chip?.getIc10Code());

	// Функция для обновления кода
	const updateCode = (newCode: string) => {
		runner.realContext.housing.chip?.setIc10Code(newCode);
		update();
	};

	useEffect(() => {
		runner.on("step", () => {
			const pos = runner.realContext.currentLinePosition;
			if (pos) {
				setLine(pos);
			}
		});
	}, []);
	useEffect(() => {
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
