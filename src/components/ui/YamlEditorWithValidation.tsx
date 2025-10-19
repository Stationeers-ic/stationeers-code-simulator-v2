import { Alert, Box, Show, Stack } from "@chakra-ui/react";
import { yaml } from "@codemirror/lang-yaml";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import Ajv, { type JSONSchemaType } from "ajv";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { parse } from "yaml";

// Типы для пропсов
interface ValidationError {
	message: string;
	line?: number;
	column?: number;
	type?: string;
	instancePath?: string;
}

interface YamlEditorProps {
	/** JSON Schema для валидации */
	schema: JSONSchemaType<any> | object;
	/** Начальное значение YAML */
	value?: string;
	/** Callback при изменении содержимого */
	onChange?: (value: string) => void;
	/** Callback при валидации */
	onValidation?: (parsedData: any | null, isValid: boolean, errors: ValidationError[]) => void;
	/** Тема редактора */
	theme?: "light" | "dark";
	/** Дополнительные пропсы для CodeMirror */
	codeMirrorProps?: Omit<ReactCodeMirrorProps, "value" | "onChange" | "extensions" | "basicSetup">;
}

const YamlEditorWithValidation: React.FC<YamlEditorProps> = ({
	schema,
	value = "",
	onChange,
	onValidation,
	codeMirrorProps = {},
}) => {
	const [yamlValue, setYamlValue] = useState<string>(value);
	const [errors, setErrors] = useState<ValidationError[]>([]);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [_parsedData, setParsedData] = useState<any>(null);

	const [showValid, setShowValid] = useState(false);

	useEffect(() => {
		if (isValid && yamlValue.trim()) {
			setShowValid(true);
			const timer = setTimeout(() => {
				setShowValid(false);
			}, 1500);

			return () => clearTimeout(timer);
		} else {
			setShowValid(false);
		}
	}, [isValid, yamlValue]);

	const validateYaml = useCallback(
		(text: string) => {
			if (!text.trim()) {
				const emptyErrors: ValidationError[] = [];
				setErrors(emptyErrors);
				setIsValid(false);
				setParsedData(null);
				onValidation?.(null, false, emptyErrors);
				return;
			}

			try {
				const parsed = parse(text);
				setParsedData(parsed);

				const ajv = new Ajv();
				const validate = ajv.compile(schema);
				const valid = validate(parsed);

				if (valid) {
					const emptyErrors: ValidationError[] = [];
					setErrors(emptyErrors);
					setIsValid(true);
					onValidation?.(parsed, true, emptyErrors);
				} else {
					const validationErrors: ValidationError[] = (validate.errors || []).map((error) => ({
						message: error.message || "Validation error",
						instancePath: error.instancePath,
						type: error.keyword,
					}));
					setErrors(validationErrors);
					setIsValid(false);
					onValidation?.(parsed, false, validationErrors);
				}
			} catch (yamlError: any) {
				const errorList: ValidationError[] = [
					{
						message: yamlError.message,
						line: yamlError.linePos?.[0]?.line,
						column: yamlError.linePos?.[0]?.col,
						type: "yaml-syntax",
					},
				];
				setErrors(errorList);
				setIsValid(false);
				setParsedData(null);
				onValidation?.(null, false, errorList);
			}
		},
		[schema, onValidation],
	);

	const handleChange = useCallback(
		(value: string) => {
			setYamlValue(value);
			onChange?.(value);
			validateYaml(value);
		},
		[onChange, validateYaml],
	);

	useEffect(() => {
		if (value !== yamlValue) {
			setYamlValue(value);
			validateYaml(value);
		}
	}, [value]);

	useEffect(() => {
		if (value) {
			validateYaml(value);
		}
	}, []);

	const getErrorMessage = (error: ValidationError): string => {
		if (error.type === "yaml-syntax") {
			return `YAML Syntax Error: ${error.message}`;
		}

		const path = error.instancePath ? `at path "${error.instancePath}"` : "";
		return `${error.message} ${path}`.trim();
	};

	return (
		<div
			className="yaml-editor-with-validation"
			style={{ width: codeMirrorProps.width || "100%", position: "relative" }}
		>
			<div className="editor-wrapper">
				<div className={`editor-container ${!isValid && errors.length > 0 ? "has-errors" : ""}`}>
					<CodeMirror
						value={yamlValue}
						height={codeMirrorProps.height || "400px"}
						extensions={[yaml()]}
						onChange={handleChange}
						{...codeMirrorProps}
					/>
				</div>

				{errors.length > 0 && (
					<Box
						style={{
							position: "absolute",
							bottom: "12px",
							left: "12px",
							right: "12px",
							zIndex: 11,
						}}
					>
						<Stack gap="4" width="full" maxH={200} overflow="auto">
							{errors.map((error, index) => (
								<Alert.Root key={index} status="error">
									<Alert.Indicator />
									<Alert.Title>{getErrorMessage(error)}</Alert.Title>
								</Alert.Root>
							))}
						</Stack>
					</Box>
				)}

				<Show when={showValid}>
					<Box
						style={{
							position: "absolute",
							bottom: "12px",
							left: "12px",
							right: "12px",
							zIndex: 11,
						}}
					>
						<Alert.Root status="success">
							<Alert.Indicator />
							<Alert.Title>Is valid</Alert.Title>
						</Alert.Root>
					</Box>
				</Show>
			</div>
		</div>
	);
};

export default YamlEditorWithValidation;
