// stores/initialEnvStore.ts

import type { EnvSchema } from "@stationeers-ic/ic10";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RepoItem } from "@/core/repositories/Repo.class";
import { json2string, string2Json } from "@/helpers";

export const startEnvConfig: EnvSchema = {
	version: 1,
	chips: [
		{
			id: 1,
			code: "",
		},
		{
			id: 2,
			code: "",
		},
	],
	project: {
		name: "new Project",
	},
	devices: [
		{
			id: 1,
			PrefabName: "StructureCircuitHousingCompact",
			chip: 1,
			pins: [
				{
					pin: "d1",
					device: 2,
				},
			],
			ports: [
				{
					port: "default",
					network: "base",
				},
			],
		},
		{
			id: 2,
			PrefabName: "StructureAirConditioner",
			chip: 2,
			ports: [
				{
					port: "default",
					network: "base",
				},
			],
		},
	],
	networks: [
		{
			id: "base",
			type: "data",
		},
	],
};

type EnvConfig = EnvSchema;

interface InitialEnvState {
	// Старый API - для обратной совместимости
	initialEnv: string;
	hasChange: boolean;
	setHasChange: (hasChange: boolean) => void;
	setInitialEnv: (env: string) => void;
	getInitialEnv: () => string;
	resetInitialEnv: () => void;

	// Новый API - работа с блоками
	version: number;
	project: EnvConfig["project"];
	chips: EnvConfig["chips"];
	devices: EnvConfig["devices"];
	networks: EnvConfig["networks"];

	setVersion: (version: number) => void;
	setChips: (chips: EnvConfig["chips"]) => void;
	setDevices: (devices: EnvConfig["devices"]) => void;
	setNetworks: (networks: EnvConfig["networks"]) => void;

	getEnvConfig: () => EnvConfig;
	setEnvConfig: (config: Partial<EnvConfig>) => void;
	resetEnvConfig: () => void;

	setChipCode: (chipId: number, code: string) => void;
}

export const configToString = (config: EnvConfig): string => {
	return json2string({
		$schema: "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
		...config,
	});
};

const stringToConfig = (str: string): EnvConfig | null => {
	try {
		const parsed = string2Json<EnvConfig>(str);
		return {
			version: parsed.version ?? startEnvConfig.version,
			project: parsed.project,
			chips: parsed.chips ?? startEnvConfig.chips,
			devices: parsed.devices ?? startEnvConfig.devices,
			networks: parsed.networks ?? startEnvConfig.networks,
		};
	} catch {
		return null;
	}
};

export const useInitialEnvStore = create<InitialEnvState>()(
	devtools(
		(set, get) => ({
			// Инициализация старых полей
			initialEnv: "",
			hasChange: false,

			// Инициализация новых полей
			version: startEnvConfig.version,
			project: undefined,
			chips: startEnvConfig.chips,
			devices: startEnvConfig.devices,
			networks: startEnvConfig.networks,

			setHasChange: (hasChange) => {
				set({ hasChange });
			},

			setInitialEnv: (initialEnv) => {
				try {
					const config = stringToConfig(initialEnv);
					if (config) {
						set({
							hasChange: true,
							initialEnv: initialEnv,
							version: config.version,
							project: config.project,
							chips: config.chips,
							devices: config.devices,
							networks: config.networks,
						});
					} else {
						set({ initialEnv: initialEnv });
					}
				} catch (error) {
					set({ initialEnv: initialEnv });
				}
			},

			getInitialEnv: () => get().initialEnv,

			resetInitialEnv: () =>
				set({
					hasChange: true,
					initialEnv: configToString(startEnvConfig),
					version: startEnvConfig.version,
					chips: startEnvConfig.chips,
					devices: startEnvConfig.devices,
					networks: startEnvConfig.networks,
				}),

			// Новый API - обновление отдельных блоков
			setVersion: (version) =>
				set((state) => {
					const newConfig = {
						version,
						chips: state.chips,
						devices: state.devices,
						networks: state.networks,
					};
					return {
						version,
						hasChange: true,
						initialEnv: configToString(newConfig),
					};
				}),

			setChips: (chips) =>
				set((state) => {
					const newConfig = {
						version: state.version,
						chips,
						devices: state.devices,
						networks: state.networks,
					};
					return {
						chips,
						hasChange: true,
						initialEnv: configToString(newConfig),
					};
				}),

			setDevices: (devices) =>
				set((state) => {
					const newConfig = {
						version: state.version,
						chips: state.chips,
						devices,
						networks: state.networks,
					};
					return {
						devices,
						hasChange: true,
						initialEnv: configToString(newConfig),
					};
				}),

			setNetworks: (networks) =>
				set((state) => {
					const newConfig = {
						version: state.version,
						chips: state.chips,
						devices: state.devices,
						networks,
					};
					return {
						networks,
						hasChange: true,
						initialEnv: configToString(newConfig),
					};
				}),

			// Получение конфига как объекта
			getEnvConfig: () => {
				const state = get();
				return {
					version: state.version,
					chips: state.chips,
					project: state.project,
					devices: state.devices,
					networks: state.networks,
				};
			},

			// Обновление нескольких блоков одновременно
			setEnvConfig: (config) =>
				set((state) => {
					const newConfig = {
						version: config.version ?? state.version,
						chips: config.chips ?? state.chips,
						project: config.chips ?? state.project,
						devices: config.devices ?? state.devices,
						networks: config.networks ?? state.networks,
					} as EnvConfig;
					return {
						...newConfig,
						hasChange: true,
						initialEnv: configToString(newConfig),
					};
				}),

			// Сброс к начальным значениям
			resetEnvConfig: () =>
				set({
					initialEnv: "",
					version: undefined,
					project: undefined,
					chips: undefined,
					devices: undefined,
					networks: undefined,
				}),

			// Установка кода для конкретного чипа по ID
			setChipCode: (chipId: number, code: string) =>
				set((state) => {
					// Проверяем, существует ли чип с таким ID
					const chipIndex = state.chips.findIndex((chip) => chip.id === chipId);
					if (chipIndex === -1) {
						return state; // Чип не найден - возвращаем состояние без изменений
					}

					// Проверяем, изменился ли код
					const currentChip = state.chips[chipIndex];
					if (currentChip.code === code) {
						return state; // Код не изменился - возвращаем состояние без изменений
					}

					// Создаем новый массив chips с обновленным чипом
					const newChips = [...state.chips];
					newChips[chipIndex] = {
						...currentChip,
						code,
					};

					const newConfig = {
						version: state.version,
						chips: newChips,
						devices: state.devices,
						networks: state.networks,
					};

					return {
						hasChange: true,
						chips: newChips,
						initialEnv: configToString(newConfig),
					};
				}),
		}),
		{
			name: "initial-env-store",
		},
	),
);
const state = useInitialEnvStore.getState();
export const initialEnvStore = {
	setProject: (project: RepoItem) => {
		state.setInitialEnv(json2string(project.env));
		state.setHasChange(false);
	},
	resetEnvConfig: () => {
		state.resetEnvConfig();
		state.setHasChange(false);
	},
	getInitialEnv: () => state.getInitialEnv(),
};
