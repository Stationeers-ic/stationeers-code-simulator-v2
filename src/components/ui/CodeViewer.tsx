import type React from "react";
import { BaseEditor } from "@/components/BaseEditor";
import { json2string } from "@/helpers";

interface JsonViewerProps {
	data: object | string;
	language: string;
	height?: string | number;
}

const CodeViewer: React.FC<JsonViewerProps> = ({ data, language, height = 400 }) => {
	const jsonString = typeof data === "string" ? data : json2string(data);

	return (
		<BaseEditor
			height={height}
			language={language}
			value={jsonString}
			readOnly={true}
			options={{
				lineNumbers: "off",
				folding: false,
				foldingHighlight: false,
				foldingImportsByDefault: false,
				showFoldingControls: "never",
				glyphMargin: false,
				lineDecorationsWidth: 0,
				lineNumbersMinChars: 0,
				scrollbar: {
					horizontal: "hidden",
					vertical: "hidden",
					alwaysConsumeMouseWheel: false,
				},
				overviewRulerBorder: false,
				overviewRulerLanes: 0,
				hideCursorInOverviewRuler: true,
				scrollBeyondLastLine: false,
				contextmenu: false,
				quickSuggestions: false,
				suggestOnTriggerCharacters: false,
				parameterHints: { enabled: false },
				hover: { enabled: false },
				renderLineHighlight: "none",
				matchBrackets: "never",
				selectionHighlight: false,
				renderValidationDecorations: "off",
				fontSize: 14,
				wordWrap: "on",
				automaticLayout: true,
			}}
			onMount={(editor) => {
				// Дополнительная настройка после монтирования
				editor.updateOptions({
					tabSize: 2,
					insertSpaces: true,
				});
			}}
		/>
	);
};

export default CodeViewer;
