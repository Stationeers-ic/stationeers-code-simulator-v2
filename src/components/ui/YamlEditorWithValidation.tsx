import { Alert, Box, Show, Stack } from "@chakra-ui/react";
import { yaml } from "@codemirror/lang-yaml";
import CodeMirror, { type ReactCodeMirrorProps } from "@uiw/react-codemirror";
import Ajv, { type JSONSchemaType } from "ajv";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { parse } from "yaml";

// Типы для пропсов
interface ValidationError {
	message: string;
	line?: number;
	column?: number;
	type?: string;
	instancePath?: string;
	params?: Record<string, any>;
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
	/** Дополнительные пропсы для CodeMirror */
	codeMirrorProps?: Omit<ReactCodeMirrorProps, "value" | "onChange" | "extensions" | "basicSetup">;
	/** Задержка debounce в миллисекундах (по умолчанию 300) */
	debounceDelay?: number;
}

const YamlEditorWithValidation: React.FC<YamlEditorProps> = ({
	schema,
	value = "",
	onChange,
	onValidation,
	codeMirrorProps = {},
	debounceDelay = 300,
}) => {
	const [yamlValue, setYamlValue] = useState<string>(value);
	const [errors, setErrors] = useState<ValidationError[]>([]);
	const [isValid, setIsValid] = useState<boolean>(false);
	const [_parsedData, setParsedData] = useState<any>(null);
	const [isValidating, setIsValidating] = useState<boolean>(false);

	const [showValid, setShowValid] = useState(false);

	// Ref для хранения таймера debounce
	const debounceTimerRef = useRef<number | null>(null);

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
			setIsValidating(false);

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
						params: error.params,
					}));

					// Группируем ошибки по instancePath и type
					const groupedErrors = validationErrors.reduce(
						(acc, error) => {
							const key = `${error.instancePath}::${error.type}`;

							if (!acc[key]) {
								acc[key] = {
									message: error.message,
									instancePath: error.instancePath,
									type: error.type,
									params: {},
									originalParams: [],
								};
							}

							acc[key].originalParams.push(error.params);

							return acc;
						},
						{} as Record<string, ValidationError & { originalParams: any[] }>,
					);

					// Объединяем params для каждой группы
					const mergedErrors: ValidationError[] = Object.values(groupedErrors).map((group) => {
						const mergedParams: Record<string, any> = {};

						// Собираем все ключи из всех params
						const allKeys = new Set<string>();
						group.originalParams.forEach((param) => {
							if (param) {
								Object.keys(param).forEach((key) => allKeys.add(key));
							}
						});

						// Для каждого ключа собираем все значения
						allKeys.forEach((key) => {
							const values = group.originalParams
								.filter((param) => param && param[key] !== undefined)
								.map((param) => param[key]);

							// Если значений больше одного, делаем массив, иначе оставляем одно значение
							if (values.length > 1) {
								// Убираем дубликаты
								mergedParams[key] = Array.from(new Set(values));
							} else if (values.length === 1) {
								mergedParams[key] = values[0];
							}
						});

						return {
							message: group.message,
							instancePath: group.instancePath,
							type: group.type,
							params: mergedParams,
						};
					});

					setErrors(mergedErrors);
					setIsValid(false);
					onValidation?.(parsed, false, mergedErrors);
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

	// Debounced версия валидации
	const debouncedValidate = useCallback(
		(text: string) => {
			// Очищаем предыдущий таймер
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			setIsValidating(true);

			// Устанавливаем новый таймер
			debounceTimerRef.current = setTimeout(() => {
				validateYaml(text);
			}, debounceDelay);
		},
		[validateYaml, debounceDelay],
	);

	const handleChange = useCallback(
		(value: string) => {
			setYamlValue(value);
			onChange?.(value);
			debouncedValidate(value);
		},
		[onChange, debouncedValidate],
	);

	useEffect(() => {
		if (value !== yamlValue) {
			setYamlValue(value);
			debouncedValidate(value);
		}
	}, [value]);

	useEffect(() => {
		if (value) {
			validateYaml(value);
		}
	}, []);

	// Очистка таймера при размонтировании
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const getErrorMessage = (error: ValidationError): string => {
		if (error.type === "yaml-syntax") {
			return `YAML Syntax Error: ${error.message}`;
		}

		const path = error.instancePath ? `at path "${error.instancePath}"` : "";

		// Форматируем params для отображения
		let paramsInfo = "";
		if (error.params) {
			const paramEntries = Object.entries(error.params);
			if (paramEntries.length > 0) {
				paramsInfo = paramEntries
					.map(([key, value]) => {
						if (Array.isArray(value)) {
							return `${key}: [${value.join(", ")}]`;
						}
						return `${key}: ${value}`;
					})
					.join(", ");
				paramsInfo = ` (${paramsInfo})`;
			}
		}

		return `${error.message} ${path}${paramsInfo}`.trim();
	};

	const uniqueErrors = Array.from(new Map(errors.map((error) => [getErrorMessage(error), error])).values());

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

				{isValidating && (
					<Box
						style={{
							position: "absolute",
							bottom: "12px",
							right: "12px",
							zIndex: 10,
							padding: "8px 12px",
							background: "rgba(0, 0, 0, 0.7)",
							color: "white",
							borderRadius: "4px",
							fontSize: "12px",
						}}
					>
						Validating...
					</Box>
				)}

				{uniqueErrors.length > 0 && (
					<Box
						style={{
							position: "absolute",
							bottom: "-12px",
							left: "12px",
							right: "12px",
							zIndex: 11,
						}}
					>
						<Stack gap="4" width="full" maxH={200} overflow="auto">
							{uniqueErrors.map((error, index) => (
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
