import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { ic10 } from "codemirror-lang-ic10";
import type { Ic10Runner } from "ic10";
import { useState } from "react";

type Ic10CodeProps = {
	runner: Ic10Runner;
	update: () => void;
};

export function Ic10Code(props: Ic10CodeProps) {
	const { runner, update } = props;

	const [code, _setCode] = useState(runner.realContext.housing.chip?.getIc10Code());

	const updateCode = (newCode: string) => {
		runner.realContext.housing.chip?.setIc10Code(newCode);
		update();
	};

	return <CodeMirror value={code} onChange={updateCode} height={"600px"} theme={vscodeDark} extensions={[ic10()]} />;
}

export default Ic10Code;
