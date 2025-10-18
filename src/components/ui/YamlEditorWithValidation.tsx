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

    const getErrorMessage = (error: ValidationError): string => {
        if (error.type === "yaml-syntax") {
            return `YAML Syntax Error: ${error.message}`;
        }

        const path = error.instancePath ? `at path "${error.instancePath}"` : "";
        return `${error.message} ${path}`.trim();
    };

    return (
        <div className="yaml-editor-with-validation" style={{ width: codeMirrorProps.width || "100%" }}>
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
                <div className="validation-errors">
                    <div className="errors-header">
                        <strong>Validation Errors:</strong>
                        <span className="error-count">{errors.length} error(s)</span>
                    </div>
                    <div className="errors-list">
                        {errors.map((error, index) => (
                            <div key={index} className="error-item">
                                <span className="error-icon">❌</span>
                                <span className="error-message">
                                    {getErrorMessage(error)}
                                    {error.line !== undefined && (
                                        <span className="error-location">
                                            (line: {error.line}, column: {error.column})
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isValid && yamlValue.trim() && (
                <div className="validation-success">
                    <span className="success-icon">✅</span>
                    YAML is valid and conforms to the schema
                </div>
            )}

            <style>{`
        .yaml-editor-with-validation {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .editor-container {
          border: 2px solid #e1e5e9;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        
        .editor-container.has-errors {
          border-color: #e74c3c;
        }
        
        .validation-errors {
          margin-top: 12px;
          padding: 12px;
          background-color: #fee;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
        }
        
        .errors-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .error-count {
          background: #e74c3c;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
        
        .error-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 4px 0;
          font-size: 14px;
        }
        
        .error-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
        
        .error-message {
          flex: 1;
        }
        
        .error-location {
          font-size: 12px;
          color: #666;
          margin-left: 8px;
        }
        
        .validation-success {
          margin-top: 12px;
          padding: 8px 12px;
          background-color: #efffed;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          color: #155724;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .success-icon {
          font-size: 16px;
        }
      `}</style>
        </div>
    );
};

export default YamlEditorWithValidation;