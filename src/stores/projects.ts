import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import repoList from "@/core/repositories";
import type { Repo, RepoItem } from "@/core/repositories/Repo.class";
import { initialEnvStore } from "./initialEnvStore";
export type RepositoryConfig = {
	localStorage: {
		enable: boolean;
	};
	gist: {
		enable: boolean;
		token: string;
	};
};
export type RepositoryKey = keyof RepositoryConfig;
export type ProjectLists = Record<RepositoryKey, Record<string, RepoItem>>;
export const isRepositoryKey = (key: any): key is RepositoryKey => {
	if (typeof key !== "string") return false;
	return key in repoList;
};
export interface ProjectStore {
	selectedRepository: RepositoryKey | null;
	selectedProject: string | null;
	repositories: RepositoryConfig;
	projects: ProjectLists;

	// Репозиторий методы
	setLocalStorageEnable: (enable: boolean) => void;
	setGistEnable: (enable: boolean) => void;
	setGistToken: (token: string) => void;

	// Проекты методы
	addProject: (project: RepoItem) => void;
	removeLocalStorageProject: (id: string) => void;
	removeGistProject: (id: string) => void;
	updateLocalStorageProject: (id: string, project: RepoItem) => void;
	updateGistProject: (id: string, project: RepoItem) => void;

	// Выбор методов
	setSelectedProject: (repository: RepositoryKey | null, project: string | null) => void;

	getSelectedRepository: () => Repo | null;
	getSelectedProject: () => RepoItem | null;
	getProject: (repository: RepositoryKey, project: string) => RepoItem | null;

	getRepositoryProjects: (repo: RepositoryKey) => Record<string, RepoItem> | null;
}

export const useProjectStore = create<ProjectStore>()(
	persist(
		devtools(
			immer((set, get) => ({
				selectedRepository: null,
				selectedProject: null,
				repositories: {
					localStorage: {
						enable: true,
					},
					gist: {
						enable: true,
						token: "",
					},
				},
				projects: {
					localStorage: {},
					gist: {},
				},

				getSelectedRepository: () => {
					const repo = get().selectedRepository;
					if (!isRepositoryKey(repo)) {
						return null;
					}
					return repoList[repo];
				},
				getSelectedProject: () => {
					const repo = get().selectedRepository;
					if (!isRepositoryKey(repo)) {
						return null;
					}
					const project = get().selectedProject;
					if (!project) {
						return null;
					}
					const repoItem = get().projects[repo][project];
					if (!repoItem) {
						return null;
					}
					return repoItem;
				},
				getProject(repo, project) {
					if (!isRepositoryKey(repo)) {
						return null;
					}
					const repoItem = get().projects[repo][project];
					if (!repoItem) {
						return null;
					}
					return repoItem;
				},
				getRepositoryProjects: (repo) => {
					if (!isRepositoryKey(repo)) {
						return null;
					}
					return get().projects[repo];
				},

				// Репозиторий методы
				setLocalStorageEnable: (enable) =>
					set((state) => {
						state.repositories.localStorage.enable = enable;
					}),

				setGistEnable: (enable) =>
					set((state) => {
						state.repositories.gist.enable = enable;
					}),

				setGistToken: (token) =>
					set((state) => {
						state.repositories.gist.token = token;
					}),

				addProject: (project: RepoItem) =>
					set((state) => {
						// Проверка типа репозитория
						if (!isRepositoryKey(project.repo)) {
							console.error(`Invalid repository: ${project.repo}`);
							return;
						}

						const repoKey = project.repo as RepositoryKey;

						// Проверяем, что репозиторий включен
						if (!state.repositories[repoKey]?.enable) {
							console.error(`Repository ${repoKey} is disabled`);
							return;
						}

						// Проверяем уникальность имени проекта
						if (state.projects[repoKey][project.name]) {
							console.error(`Project ${project.name} already exists in ${repoKey}`);
							return;
						}

						// Безопасное добавление
						state.projects[repoKey][project.name] = project;
					}),

				removeLocalStorageProject: (id) =>
					set((state) => {
						delete state.projects.localStorage[id];
					}),

				removeGistProject: (id) =>
					set((state) => {
						delete state.projects.gist[id];
					}),

				updateLocalStorageProject: (id, project) =>
					set((state) => {
						if (state.projects.localStorage[id]) {
							state.projects.localStorage[id] = project;
						}
					}),

				updateGistProject: (id, project) =>
					set((state) => {
						if (state.projects.gist[id]) {
							state.projects.gist[id] = project;
						}
					}),

				setSelectedProject: (repository, project) => {
					set((state) => {
						state.selectedRepository = repository;
						state.selectedProject = project;
					});
					const p = get().getSelectedProject();
					if (p) {
						initialEnvStore.setProject(p);
					} else {
						initialEnvStore.resetEnvConfig();
					}
				},
			})),
		),
		{
			name: "project-store",
			partialize: (state) => ({
				selectedRepository: state.selectedRepository,
				selectedProject: state.selectedProject,
				repositories: state.repositories,
			}),
		},
	),
);

export const projectStore = {
	addProject: (project: RepoItem) => useProjectStore.getState().addProject(project),
	getSelectedProject: (): RepoItem | null => useProjectStore.getState().getSelectedProject(),
};
