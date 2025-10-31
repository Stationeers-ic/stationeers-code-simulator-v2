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

	save(env: EnvSchema | undefined = undefined): void | Promise<void> {
		if (env) {
			this.env = env;
		}
		return repoList[this.repo].save(this);
	}
}

export interface Repo {
	repoName: RepositoryKey;
	save(item: RepoItem): void | Promise<void>;
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
			projectStore.setProject(element);
		}
	}
}
