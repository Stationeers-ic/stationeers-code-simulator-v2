// components/ui/Ic10Code.tsx
import { Alert } from "@chakra-ui/react";
import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";
import { createRuler, ic10, ic10Snippets, lineClassController, zeroLineNumbers } from "codemirror-lang-ic10";
import { type Chip, type ChipSchema, type EnvSchema, ValidateIc10Runner } from "ic10";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { parse, stringify } from "yaml";
import { useIc10Store } from "@/stores/ic10Store";
import { useTerminalStore } from "@/stores/terminalStore";

type Ic10CodeProps = {
	chip: Chip;
};
type Timeout = ReturnType<typeof setTimeout>;
const [ruler] = createRuler(90, "ruler");
export function Ic10Code(props: Ic10CodeProps) {
	const { t } = useTranslation();
	const { chip } = props;
	const runner = chip?.housing?.runner;
	const updateCounter = useIc10Store((state) => state.updateCounter);
	const { addToTerminal, clearTerminal } = useTerminalStore();
	const { initialEnv, setInitialEnv } = useIc10Store();

	const [line, setLine] = useState(() => {
		const position = runner?.realContext?.currentLinePosition;
		return position !== undefined ? position + 1 : 1;
	});
	const [cmLine] = useState(new lineClassController("nextRunLine"));
	const [code, setCode] = useState(() => runner?.realContext?.housing?.chip?.getIc10Code() || "");

	const debounceTimerRef = useRef<Timeout | null>(null);

	useEffect(() => {
		if (runner) {
			cmLine.highlightLine(line);
		}
	}, [line, cmLine, runner]);

	useEffect(() => {
		if (runner) {
			const newCode = runner.realContext?.housing?.chip?.getIc10Code() || "";
			setCode(newCode);
			const pos = runner.realContext?.currentLinePosition;
			setLine(pos !== undefined ? pos + 1 : 1);
		}
	}, [updateCounter, runner]);

	const updateCode = useCallback(
		(newCode: string) => {
			setCode(newCode);

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

	useEffect(() => {
		ValidateIc10Runner.validate(code).then((errors) => {
			clearTerminal();
			errors.forEach((error) => {
				addToTerminal(error.formated_message);
			});
		});
	}, [code]);

	// Проверка наличия runner ПОСЛЕ всех хуков
	if (!runner) {
		return (
			<Alert.Root status="error">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>{t("ic10Code.error")}</Alert.Title>
					<Alert.Description>{t("ic10Code.missingRunner", { chipId: chip.id })}</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	return (
		<CodeMirror
			key={`editor-${chip.id}-${updateCounter}`}
			value={code}
			onChange={updateCode}
			height={"580px"}
			theme={vscodeDark}
			extensions={[ic10(), EditorView.lineWrapping, zeroLineNumbers, cmLine.extension, ic10Snippets(), ruler]}
		/>
	);
}

export default Ic10Code;
