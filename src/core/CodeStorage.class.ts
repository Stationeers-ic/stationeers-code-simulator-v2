export type StoredItem = {
	name: string;
	code: string;
	description?: string;
};

export abstract class CodeStorage {
	protected constructor() {}

	abstract save(item: StoredItem): void | Promise<void>;
	abstract load(name: string): string | Promise<string>;
	abstract delete(name: string): string[] | Promise<string[]>;
	abstract list(): StoredItem[] | Promise<StoredItem[]>;
	abstract getItem(name: string): (StoredItem | null) | Promise<StoredItem | null>;
}

export class LocalStorageCodeStorage extends CodeStorage {
	private static instance: LocalStorageCodeStorage;

	private readonly storageKey = "code_storage_items";

	public static getInstance(): LocalStorageCodeStorage {
		if (!LocalStorageCodeStorage.instance) {
			LocalStorageCodeStorage.instance = new LocalStorageCodeStorage();
		}
		return LocalStorageCodeStorage.instance;
	}

	private getStoredItems(): Record<string, StoredItem> {
		try {
			const stored = localStorage.getItem(this.storageKey);
			return stored ? JSON.parse(stored) : {};
		} catch (error) {
			console.error("Error reading from localStorage:", error);
			return {};
		}
	}

	private setStoredItems(items: Record<string, StoredItem>): void {
		try {
			localStorage.setItem(this.storageKey, JSON.stringify(items));
		} catch (error) {
			console.error("Error writing to localStorage:", error);
		}
	}

	async save(item: StoredItem): Promise<void> {
		const items = this.getStoredItems();
		items[item.name] = item;
		this.setStoredItems(items);
	}

	async load(name: string): Promise<string> {
		const items = this.getStoredItems();
		const item = items[name];
		if (!item) {
			throw new Error(`Item with name "${name}" not found`);
		}
		return item.code;
	}

	async delete(name: string): Promise<string[]> {
		const items = this.getStoredItems();
		if (!items[name]) {
			throw new Error(`Item with name "${name}" not found`);
		}
		delete items[name];
		this.setStoredItems(items);
		return Object.keys(items);
	}

	async list(): Promise<StoredItem[]> {
		const items = this.getStoredItems();
		return Object.values(items);
	}

	// Optional: Clear all stored items
	async clear(): Promise<void> {
		this.setStoredItems({});
	}

	// Optional: Get item with full details
	getItem(name: string): StoredItem | null {
		const items = this.getStoredItems();
		return items[name] || null;
	}
}

export default {
	LocalStorageCodeStorage,
};
