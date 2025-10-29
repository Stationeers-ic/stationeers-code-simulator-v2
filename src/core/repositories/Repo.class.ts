import type { EnvSchema } from "@stationeers-ic/ic10";

export abstract class Repo {
	protected constructor() {}

	abstract save(item: EnvSchema): void | Promise<void>;
	abstract load(name: string): EnvSchema | Promise<EnvSchema>;
	abstract delete(name: string): string[] | Promise<string[]>;
	abstract list(): EnvSchema[] | Promise<EnvSchema[]>;
	abstract getItem(name: string): (EnvSchema | null) | Promise<EnvSchema | null>;
}
