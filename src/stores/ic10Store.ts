// stores/ic10Store.ts

import * as ic10 from "ic10";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useTerminalStore } from "./terminalStore";

interface Ic10State {
	// Состояние
	currentEnv: string;
	chips: ic10.Chip[] | null;
	loading: boolean;
	initialized: boolean;
	builder: ic10.Builer | null;

	// Действия
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

	// Новые функции
	getRealContextByChipId: (chipId: number) => ic10.RealContext | null;

	updateCounter: number;
	forceUpdate: () => void;
}

export const useIc10Store = create<Ic10State>()(
	devtools(
		(set, get) => ({
			// Начальное состояние
			currentEnv: "",
			chips: null,
			loading: false,
			initialized: false,
			builder: null,
			updateCounter: 0,

			forceUpdate: () => set((state) => ({ updateCounter: state.updateCounter + 1 })),

			// Сеттеры
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

			// Новая функция для получения realContext по ID чипа
			getRealContextByChipId: (chipId: number) => {
				const { builder } = get();

				if (!builder) {
					return null;
				}

				// Ищем раннер с нужным chipId
				for (const runner of builder.Runners.values()) {
					if (runner.realContext.housing?.id === chipId) {
						return runner.realContext;
					}
				}

				return null;
			},
		}),
		{
			name: "ic10-store",
		},
	),
);
