import type { EnvSchema } from "@stationeers-ic/ic10";
import { type RepositoryKey, useProjectStore } from "@/stores/projects";

export class RepoItem {
	constructor(
		public repo: RepositoryKey,
		public name: string,
		public env: EnvSchema,
	) {}
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
		const { addProject } = useProjectStore();

		const list = await this.list();
		for (const element of list) {
			addProject(element);
		}
	}
}
