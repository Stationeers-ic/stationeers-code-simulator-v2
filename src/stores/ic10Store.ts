// stores/ic10Store.ts

import * as ic10 from "ic10";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useTerminalStore } from "./terminalStore";

interface Ic10State {
	// Состояние
	initialEnv: string;
	currentEnv: string;
	chips: ic10.Chip[] | null;
	loading: boolean;
	initialized: boolean;
	builder: ic10.Builer | null;

	// Действия
	setInitialEnv: (env: string) => void;
	setCurrentEnv: (env: string) => void;
	setChips: (runners: Map<number, ic10.Chip>) => void;
	setLoading: (loading: boolean) => void;
	setInitialized: (initialized: boolean) => void;
	setBuilder: (builder: ic10.Builer | null) => void;

	// IC10 операции
	initializeFromYaml: (yaml: string) => Promise<void>;
	step: () => Promise<void>;
	getCurrentEnv: () => string | undefined;
	getDebugEnv: () => string | undefined;
	getInitialEnv: () => string | undefined;

	updateCounter: number;
	forceUpdate: () => void;
}

const startEnv = `{
   "$schema": "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
   "version": 1,
   "chips": [
      {
         "id": 1,
         "code": ""
      }
   ],
   "devices": [
      {
         "id": 1,
         "PrefabName": "StructureCircuitHousingCompact",
         "chip": 1,
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

export const useIc10Store = create<Ic10State>()(
	devtools(
		persist(
			(set, get) => ({
				// Начальное состояние
				initialEnv: startEnv,
				currentEnv: "",
				chips: null,
				loading: false,
				initialized: false,
				builder: null,
				updateCounter: 0,

				forceUpdate: () => set((state) => ({ updateCounter: state.updateCounter + 1 })),

				// Сеттеры
				setInitialEnv: (initialEnv) => set({ initialEnv: initialEnv.trim() }),
				setCurrentEnv: (currentEnv) => set({ currentEnv }),
				setChips: (chips) => set({ chips: Array.from(chips.entries()).map((a) => a[1]) }),
				setLoading: (loading) => set({ loading }),
				setInitialized: (initialized) => set({ initialized }),
				setBuilder: (builder) => set({ builder }),

				// IC10 операции
				initializeFromYaml: async (yaml: string) => {
					const { setChips, forceUpdate } = get();
					try {
						set({ initialized: false, loading: true });

						const builder = ic10.Builer.from(yaml);
						await builder.init();
						set({
							currentEnv: builder.toJson(),
							builder,
							initialized: true,
						});
						setChips(builder.Chips);

						// Обработка ошибок
						builder.Runners.forEach((runner) => {
							runner.realContext.reset();
							runner.sanboxContext.$errors.forEach((error) => {
								if (error) {
									useTerminalStore
										.getState()
										.addToTerminal(`[chip: ${runner.realContext.housing.id}] ${error.formated_message}`);
								}
							});
						});
						set({ loading: false });
					} catch (e) {
						if (e instanceof ic10.Ic10Error) {
							useTerminalStore.getState().addToTerminal(e.formated_message);
						} else if (e instanceof Error) {
							useTerminalStore.getState().addToTerminal(e.message);
						} else {
							useTerminalStore.getState().addToTerminal("Error");
						}
						set({ loading: false, initialized: false });
					}
					forceUpdate();
				},

				step: async () => {
					const { builder, initialized, setCurrentEnv, setInitialized, forceUpdate } = get();

					if (!builder || !initialized) {
						useTerminalStore.getState().addToTerminal("Not initialized");
						return;
					}

					try {
						const end = await builder.step();
						if (end === false) {
							setInitialized(false);
						}
						const newEnv = builder.toJson();
						setCurrentEnv(newEnv);

						// Обработка ошибок
						builder.Runners.forEach((runner) => {
							runner.realContext.$errors.forEach((error) => {
								if (error) {
									useTerminalStore
										.getState()
										.addToTerminal(`[chip: ${runner.realContext.housing.id}] ${error.formated_message}`);
								}
							});
						});
					} catch (e) {
						if (e instanceof ic10.Ic10Error) {
							useTerminalStore.getState().addToTerminal(e.formated_message);
						}
						console.warn(e);
						setInitialized(false);
					}
					forceUpdate();
				},

				getCurrentEnv: () => {
					const { builder } = get();
					return builder?.toJson();
				},
				getDebugEnv: () => {
					const { builder } = get();
					return builder?.toJson();
				},
				getInitialEnv: () => {
					const { initialEnv } = get();
					return initialEnv;
				},
			}),
			{
				name: "ic10-storage",
				partialize: (state) => ({
					initialEnv: state.initialEnv,
				}),
				onRehydrateStorage: () => (state) => {
					// Проверяем после восстановления из localStorage
					if (state && (!state.initialEnv || !state.initialEnv.trim())) {
						state.initialEnv = startEnv;
					}
				},
				migrate: (persistedState: any, version: number) => {
					if (version === 0) {
						return persistedState;
					}
					return persistedState;
				},
				version: 1,
			},
		),
	),
);
