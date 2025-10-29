// hooks/useJsonSchema.ts
import { use } from "react";
import { fetchData } from "@/stores/data";

export const ENV_SCHEMA_URL =
	"https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json";

export const useEnvSchema = () => {
	const schema = use<any>(fetchData(ENV_SCHEMA_URL));
	return { schema, schemaUri: ENV_SCHEMA_URL };
};
