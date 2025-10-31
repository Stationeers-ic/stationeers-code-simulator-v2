import { json2string, string2Json } from "@/helpers";
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

	async save(item: RepoItem): Promise<void> {
		const storageKey = this.getStorageKey(item.name);
		localStorage.setItem(storageKey, json2string(item, true));
		await this.sync();
	}

	load(name: string): RepoItem {
		const item = this.getItem(name);
		if (!item) {
			throw new Error(`Item "${name}" not found in ${this.repoName}`);
		}
		return item;
	}

	async delete(name: string): Promise<void> {
		const storageKey = this.getStorageKey(name);
		localStorage.removeItem(storageKey);

		const remainingItems = this.list();
		remainingItems.map((item) => item.name);
		await this.sync();
	}

	list(): RepoItem[] {
		const items: RepoItem[] = [];
		const prefix = this.getStorageKey("");

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(prefix)) {
				try {
					const storedValue = localStorage.getItem(key);
					if (storedValue) {
						const parsed = string2Json<RepoItem>(storedValue);
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

	getItem(name: string): RepoItem | null {
		const storageKey = this.getStorageKey(name);
		const storedValue = localStorage.getItem(storageKey);

		if (!storedValue) {
			return null;
		}

		try {
			const parsed = string2Json<RepoItem>(storedValue);
			if (parsed && parsed.name && parsed.env) {
				return new RepoItem(this.repoName, parsed.name, parsed.env);
			}
		} catch (error) {
			console.warn(`Failed to parse item "${name}":`, error);
		}

		return null;
	}
}
