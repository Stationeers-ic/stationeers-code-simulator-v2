import type { EnvSchema } from "@stationeers-ic/ic10";
import { Repo } from "./Repo.class";

export class LocalStorageCodeStorage extends Repo {
	private static instance: LocalStorageCodeStorage;

	private readonly storageKey = "code_storage_items";

	public static getInstance(): LocalStorageCodeStorage {
		if (!LocalStorageCodeStorage.instance) {
			LocalStorageCodeStorage.instance = new LocalStorageCodeStorage();
		}
		return LocalStorageCodeStorage.instance;
	}

	private getEnvSchemas(): Record<string, EnvSchema> {
		try {
			const stored = localStorage.getItem(this.storageKey);
			return stored ? JSON.parse(stored) : {};
		} catch (error) {
			console.error("Error reading from localStorage:", error);
			return {};
		}
	}

	private setEnvSchemas(items: Record<string, EnvSchema>): void {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(items));
		} catch (error) {
			console.error("Error writing to localStorage:", error);
		}
	}

	async save(item: EnvSchema): Promise<void> {
		const items = this.getEnvSchemas();
		items[item.project!.name!] = item;
		this.setEnvSchemas(items);
	}

	async load(name: string): Promise<EnvSchema> {
		const items = this.getEnvSchemas();
		const item = items[name];
		if (!item) {
			throw new Error(`Item with name "${name}" not found`);
		}
		return item;
	}

	async delete(name: string): Promise<string[]> {
		const items = this.getEnvSchemas();
		if (!items[name]) {
			throw new Error(`Item with name "${name}" not found`);
		}
		delete items[name];
		this.setEnvSchemas(items);
		return Object.keys(items);
	}

	async list(): Promise<EnvSchema[]> {
		const items = this.getEnvSchemas();
		return Object.values(items);
	}

	// Optional: Clear all stored items
	async clear(): Promise<void> {
		this.setEnvSchemas({});
	}

	// Optional: Get item with full details
	getItem(name: string): EnvSchema | null {
		const items = this.getEnvSchemas();
		return items[name] || null;
	}
}
