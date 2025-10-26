// stores/initialEnvStore.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const startEnvConfig = {
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

const startEnv = `{
   "$schema": "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
   "version": 1,
   "chips": [
      {
         "id": 1,
         "code": ""
      },
      {
         "id": 2,
         "code": ""
      }
   ],
   "devices": [
      {
         "id": 1,
         "PrefabName": "StructureCircuitHousingCompact",
         "chip": 1,
         "pins": [
            {
                "pin": "d1",
                "device": 2,
            },
         ],
         "ports": [
            {
               "port": "default",
               "network": "base"
            }
         ]
      },
      {
         "id": 2,
         "PrefabName": "StructureAirConditioner",
         "chip": 2,
         "ports": [
            {
               "port": "default",
               "network": "base"
            }
         ]
      }
   ],
   "networks": [
      {
         "id": "base",
         "type": "data"
      }
   ]
}`;

type EnvConfig = typeof startEnvConfig;

interface InitialEnvState {
	// Старый API - для обратной совместимости
	initialEnv: string;
	setInitialEnv: (env: string) => void;
	getInitialEnv: () => string;
	resetInitialEnv: () => void;

	// Новый API - работа с блоками
	version: number;
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
const configToString = (config: EnvConfig): string => {
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
		const parsed = JSON.parse(str);
		return {
			version: parsed.version ?? startEnvConfig.version,
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
		persist(
			(set, get) => ({
				// Инициализация старых полей
				initialEnv: startEnv,

				// Инициализация новых полей
				version: startEnvConfig.version,
				chips: startEnvConfig.chips,
				devices: startEnvConfig.devices,
				networks: startEnvConfig.networks,

				// Старый API
				setInitialEnv: (initialEnv) => {
					const trimmed = initialEnv.trim();
					const config = stringToConfig(trimmed);

					if (config) {
						set({
							initialEnv: trimmed,
							version: config.version,
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
						initialEnv: startEnv,
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
						initialEnv: startEnv,
						version: startEnvConfig.version,
						chips: startEnvConfig.chips,
						devices: startEnvConfig.devices,
						networks: startEnvConfig.networks,
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
			}),
			{
				name: "initial-env-storage",
				onRehydrateStorage: () => (state) => {
					if (state) {
						// Если есть старый формат (только initialEnv)
						if (state.initialEnv && state.initialEnv.trim()) {
							const config = stringToConfig(state.initialEnv);
							if (config) {
								state.version = config.version;
								state.chips = config.chips;
								state.devices = config.devices;
								state.networks = config.networks;
							}
						}
						// Если нет initialEnv, восстанавливаем из блоков или дефолта
						else if (!state.initialEnv || !state.initialEnv.trim()) {
							const config = {
								version: state.version ?? startEnvConfig.version,
								chips: state.chips ?? startEnvConfig.chips,
								devices: state.devices ?? startEnvConfig.devices,
								networks: state.networks ?? startEnvConfig.networks,
							};
							state.initialEnv = configToString(config);
							state.version = config.version;
							state.chips = config.chips;
							state.devices = config.devices;
							state.networks = config.networks;
						}
					}
				},
				version: 2, // Увеличиваем версию для миграции
			},
		),
	),
);
