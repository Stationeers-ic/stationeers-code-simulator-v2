import type { EnvSchema } from "@stationeers-ic/ic10";
import JSON5 from "json5";
import type { RepositoryKey } from "@/stores/projects";
import { Repo, RepoItem } from "./Repo.class";
export class LocalStorageCodeStorage extends Repo {
	get repoName(): RepositoryKey {
		return "localStorage";
	}
	private static instance: LocalStorageCodeStorage;

	public static getInstance(): LocalStorageCodeStorage {
		if (!LocalStorageCodeStorage.instance) {
			LocalStorageCodeStorage.instance = new LocalStorageCodeStorage();
		}
		return LocalStorageCodeStorage.instance;
	}

	private constructor() {
		super();
		this.sync();
	}

	private getStorageKey(name: string): string {
		return `${this.repoName}_${name}`;
	}

	async save(name: string, item: EnvSchema): Promise<void> {
		const storageKey = this.getStorageKey(name);
		const repoItem = new RepoItem(this.repoName, name, item);
		localStorage.setItem(storageKey, JSON.stringify(repoItem));
		await this.sync();
	}

	async load(name: string): Promise<RepoItem> {
		const item = await this.getItem(name);
		if (!item) {
			throw new Error(`Item "${name}" not found in ${this.repoName}`);
		}
		return item;
	}

	async delete(name: string): Promise<string[]> {
		const storageKey = this.getStorageKey(name);
		localStorage.removeItem(storageKey);

		const remainingItems = await this.list();
		return remainingItems.map((item) => item.name);
	}

	async list(): Promise<RepoItem[]> {
		const items: RepoItem[] = [];
		const prefix = this.getStorageKey("");

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(prefix)) {
				try {
					const storedValue = localStorage.getItem(key);
					if (storedValue) {
						const parsed = JSON5.parse(storedValue);
						if (parsed && parsed.name && parsed.env) {
							items.push(new RepoItem(this.repoName, parsed.name, parsed.env));
						}
					}
				} catch (error) {
					console.warn(`Failed to parse item with key "${key}":`, error);
				}
			}
		}

		return items;
	}

	async getItem(name: string): Promise<RepoItem | null> {
		const storageKey = this.getStorageKey(name);
		const storedValue = localStorage.getItem(storageKey);

		if (!storedValue) {
			return null;
		}

		try {
			const parsed = JSON5.parse(storedValue);
			if (parsed && parsed.name && parsed.env) {
				return new RepoItem(this.repoName, parsed.name, parsed.env);
			}
		} catch (error) {
			console.warn(`Failed to parse item "${name}":`, error);
		}

		return null;
	}
}
