// stores/initialEnvStore.ts

import type { EnvSchema } from "@stationeers-ic/ic10";
import JSON5 from "json5";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RepoItem } from "@/core/repositories/Repo.class";

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

// Вспомогательная функция для создания JSON строки из конфига
export const configToString = (config: EnvConfig): string => {
	return JSON.stringify(
		{
			$schema: "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
			...config,
		},
		null,
		3,
	);
};

// Вспомогательная функция для парсинга JSON строки в конфиг
const stringToConfig = (str: string): EnvConfig | null => {
	try {
		const parsed = JSON5.parse(str);
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
	devtools((set, get) => ({
		// Инициализация старых полей
		initialEnv: "",

		// Инициализация новых полей
		version: startEnvConfig.version,
		project: undefined,
		chips: startEnvConfig.chips,
		devices: startEnvConfig.devices,
		networks: startEnvConfig.networks,

		setInitialEnv: (initialEnv) => {
			const trimmed = initialEnv.trim();
			const config = stringToConfig(trimmed);
			console.log(initialEnv.length);
			if (config) {
				set({
					initialEnv: configToString(config),
					version: config.version,
					project: config.project,
					chips: config.chips,
					devices: config.devices,
					networks: config.networks,
				});
			} else {
				set({ initialEnv: trimmed });
			}
		},

		getInitialEnv: () => get().initialEnv,

		resetInitialEnv: () =>
			set({
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
					initialEnv: configToString(newConfig),
				};
			}),

		// Получение конфига как объекта
		getEnvConfig: () => {
			const state = get();
			return {
				version: state.version,
				chips: state.chips,
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
					devices: config.devices ?? state.devices,
					networks: config.networks ?? state.networks,
				};
				return {
					...newConfig,
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
					chips: newChips,
					initialEnv: configToString(newConfig),
				};
			}),
	})),
);
export const initialEnvStore = {
	setProject: (project: RepoItem) => useInitialEnvStore.getState().setInitialEnv(JSON.stringify(project.env)),
	resetEnvConfig: () => useInitialEnvStore.getState().resetEnvConfig(),
	getInitialEnv: () => useInitialEnvStore.getState().getInitialEnv(),
};
