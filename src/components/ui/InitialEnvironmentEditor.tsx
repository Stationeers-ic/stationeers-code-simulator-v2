import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { use, useRef } from "react";
import { useTranslation } from "react-i18next";
import { fetchData } from "@/stores/data";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

export const InitialEnvironmentEditor = () => {
	const schema = use<any>(
		fetchData("https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json"),
	);
	const { t } = useTranslation();
	const { initialEnv, setInitialEnv, resetInitialEnv } = useInitialEnvStore();
	const monacoRef = useRef<Monaco | null>(null);
	// Функция для настройки Monaco Editor с JSON Schema
	const handleEditorWillMount = (monaco: Monaco) => {
		monacoRef.current = monaco;

		// Настройка JSON Schema для валидации
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
					fileMatch: ["*"], // применяется ко всем JSON файлам
					schema: schema,
				},
			],
		});
	};

	return (
		<VStack align="stretch" height="100%">
			<HStack justify="space-between">
				<Text fontWeight="bold">{t("app.initialEnvironment")}</Text>
				<Box width="47px" height={35} />
				<Button onClick={resetInitialEnv}>{t('app.reset')}</Button>
			</HStack>
			<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md" minH={"500px"}>
				<Editor
					height={"100%"}
					value={initialEnv}
					onChange={(value) => {
						value ? setInitialEnv(value) : null;
					}}
					language="json"
					options={{
						minimap: { enabled: false },
					}}
					theme="ic10"
					beforeMount={handleEditorWillMount}
				/>
			</Box>
		</VStack>
	);
};
