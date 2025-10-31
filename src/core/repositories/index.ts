import { LocalStorageCodeStorage } from "./LocalStorageCodeStorage";
import type { Repo } from "./Repo.class";

const local = LocalStorageCodeStorage.getInstance();

const list: Record<string, Repo> = {};
list[local.repoName] = local;

export default list;
