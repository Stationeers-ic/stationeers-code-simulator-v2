import { LocalStorageCodeStorage } from "./LocalStorageCodeStorage";
import type { Repo } from "./Repo.class";

export const list: Record<string, Repo> = {
	LocalStorageCodeStorage: LocalStorageCodeStorage.getInstance(),
} as const;

export default list;
