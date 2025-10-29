import type { EnvSchema } from "@stationeers-ic/ic10";
import { LocalStorageCodeStorage } from "./LocalStorageCodeStorage";

export abstract class CodeStorage {
	protected constructor() {}

	abstract save(item: EnvSchema): void | Promise<void>;
	abstract load(name: string): EnvSchema | Promise<EnvSchema>;
	abstract delete(name: string): string[] | Promise<string[]>;
	abstract list(): EnvSchema[] | Promise<EnvSchema[]>;
	abstract getItem(name: string): (EnvSchema | null) | Promise<EnvSchema | null>;
}

export const list: { [key: string]: CodeStorage } = {
	LocalStorageCodeStorage: LocalStorageCodeStorage.getInstance(),
} as const;

export default list;
