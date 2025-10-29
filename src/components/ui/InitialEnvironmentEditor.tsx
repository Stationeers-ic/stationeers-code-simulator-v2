// components/InitialEnvironmentEditor.tsx
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { JsonSchemaEditor } from "@/components/ui/JsonSchemaEditor";
import { useEnvSchema } from "@/hooks/useJsonSchema";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

export const InitialEnvironmentEditor = () => {
	const { t } = useTranslation();
	const { initialEnv, setInitialEnv, resetInitialEnv } = useInitialEnvStore();
	const { schema, schemaUri } = useEnvSchema();

	return (
		<VStack align="stretch" height={"100%"}>
			<HStack justify="space-between">
				<Text fontWeight="bold">{t("app.initialEnvironment")}</Text>
				<Box width="47px" height={35} />
				<Button onClick={resetInitialEnv}>{t("app.reset")}</Button>
			</HStack>
			<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
				<JsonSchemaEditor
					value={initialEnv}
					onChange={(value) => value && setInitialEnv(value)}
					schema={schema}
					schemaUri={schemaUri}
				/>
			</Box>
		</VStack>
	);
};
