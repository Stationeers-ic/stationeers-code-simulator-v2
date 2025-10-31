// components/InitialEnvironmentEditor.tsx
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { JsonSchemaEditor } from "@/components/ui/JsonSchemaEditor";
import { useEnvSchema } from "@/hooks/useJsonSchema";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useProjectStore } from "@/stores/projects";

export const InitialEnvironmentEditor = () => {
	const { t } = useTranslation();
	const { initialEnv, setInitialEnv, resetInitialEnv } = useInitialEnvStore();
	const { selectedProject, getSelectedProject } = useProjectStore();
	const { schema, schemaUri } = useEnvSchema();

	useEffect(() => {
		try {
			if (!initialEnv && selectedProject) {
				const env = getSelectedProject()?.toJson();
				if (env) {
					console.log("from project");
					setInitialEnv(env, true);
				} else {
					const env = localStorage.getItem("temp-store");
					if (env) {
						console.log("from local");
						setInitialEnv(env);
					}
				}
			}
		} catch (e) {}
	}, [initialEnv]);

	const onChange = (value: string | undefined) => {
		if (value) {
			try {
				setInitialEnv(value);
			} catch (e) {}
		}
	};

	return (
		<VStack align="stretch" height={"100%"}>
			<HStack justify="space-between">
				<Text fontWeight="bold">{t("app.initialEnvironment")}</Text>
				<Box width="47px" height={35} />
				<Button onClick={resetInitialEnv}>{t("app.reset")}</Button>
			</HStack>
			<Box flex={1} border="2px solid" borderColor="gray.200" borderRadius="md">
				<JsonSchemaEditor value={initialEnv} onChange={onChange} schema={schema} schemaUri={schemaUri} />
			</Box>
		</VStack>
	);
};
