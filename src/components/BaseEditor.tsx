// components/BaseEditor.tsx
import Editor, { type BeforeMount, type OnChange, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

export interface BaseEditorProps {
	value?: string;
	onChange?: OnChange;
	onMount?: OnMount;
	beforeMount?: BeforeMount;
	language?: "json" | "ic10" | string;
	theme?: string;
	options?: editor.IStandaloneEditorConstructionOptions;
	height?: string | number;
	readOnly?: boolean;
}

export const BaseEditor: React.FC<BaseEditorProps> = ({
	value,
	onChange,
	onMount,
	beforeMount,
	language = "ic10",
	theme = "ic10",
	options = {},
	height = "100%",
	readOnly = false,
}) => {
	const defaultOptions: editor.IStandaloneEditorConstructionOptions = {
		tabSize: 2,
		fontFamily: "Fira Code",
		fontLigatures: true,
		minimap: { enabled: false },
		readOnly,
		...options,
	};

	return (
		<Editor
			height={height}
			value={value}
			onChange={onChange}
			language={language}
			theme={theme}
			options={defaultOptions}
			onMount={onMount}
			beforeMount={beforeMount}
		/>
	);
};
