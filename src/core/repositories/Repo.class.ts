import type { EnvSchema } from "@stationeers-ic/ic10";
import repoList from "@/core/repositories";
import { json2string } from "@/helpers";
import { projectStore, type RepositoryKey } from "@/stores/projects";
export class RepoItem {
	constructor(
		public repo: RepositoryKey,
		public name: string,
		public env: EnvSchema,
	) {}

	toJson() {
		try {
			return json2string(this.env);
		} catch (error) {
			console.error("Error converting RepoItem to JSON:", error);
			return null;
		}
	}

	save(env: EnvSchema): void | Promise<void> {
		return repoList[this.repo].save(this.name, env);
	}
}

export interface Repo {
	repoName: RepositoryKey;
	save(name: string, item: EnvSchema): void | Promise<void>;
	load(name: string): RepoItem | Promise<RepoItem>;
	delete(name: string): string[] | Promise<string[]>;
	list(): RepoItem[] | Promise<RepoItem[]>;
	getItem(name: string): (RepoItem | null) | Promise<RepoItem | null>;
	sync(): Promise<void>;
}
export abstract class Repo {
	protected constructor() {}

	async sync(): Promise<void> {
		const list = await this.list();
		for (const element of list) {
			projectStore.addProject(element);
		}
	}
}
