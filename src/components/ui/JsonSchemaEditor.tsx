// components/JsonSchemaEditor.tsx
import { Box } from "@chakra-ui/react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { useRef } from "react";

interface JsonSchemaEditorProps {
	value: string;
	onChange?: (value: string | undefined) => void;
	schema: any;
	schemaUri: string;
	theme?: string;
	height?: string | number;
	readOnly?: boolean;
}

export const JsonSchemaEditor = ({
	value,
	onChange,
	schema,
	schemaUri,
	readOnly = false,
	theme = "ic10",
	height = "100%",
}: JsonSchemaEditorProps) => {
	const monacoRef = useRef<Monaco | null>(null);
	const isSchemaConfigured = useRef(false);

	const handleEditorWillMount = (monaco: Monaco) => {
		monacoRef.current = monaco;

		// Настраиваем схему только один раз
		if (!isSchemaConfigured.current) {
			monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
				validate: true,
				schemas: [
					{
						uri: schemaUri,
						fileMatch: ["*"],
						schema: schema,
					},
				],
			});
			isSchemaConfigured.current = true;
		}
	};

	return (
		<Box height={height}>
			<Editor
				value={value}
				onChange={onChange}
				language="json"
				options={{
					readOnly: readOnly,
					minimap: { enabled: false },
				}}
				theme={theme}
				beforeMount={handleEditorWillMount}
			/>
		</Box>
	);
};
