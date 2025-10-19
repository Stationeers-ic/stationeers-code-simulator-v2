// stores/ic10Store.ts

import * as ic10 from "ic10";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Ic10State {
	// Состояние
	initialEnv: string;
	currentEnv: string;
	terminalOutput: string[];
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

	// Действия терминала
	addToTerminal: (message: string) => void;
	clearTerminal: () => void;

	// IC10 операции
	initializeFromYaml: (yaml: string) => Promise<void>;
	step: () => Promise<void>;
	getCurrentEnv: () => string | undefined;
	getDebugEnv: () => string | undefined;
	getInitialEnv: () => string | undefined;

	updateCounter: number; // Добавьте это поле
	forceUpdate: () => void; // Добавьте это действие
}

export const useIc10Store = create<Ic10State>()(
	devtools(
		persist(
			(set, get) => ({
				// Начальное состояние
				initialEnv: "",
				currentEnv: "",
				terminalOutput: [],
				chips: null,
				loading: false,
				initialized: false,
				builder: null,
				updateCounter: 0,

				forceUpdate: () => set((state) => ({ updateCounter: state.updateCounter + 1 })),
				// Сеттеры
				setInitialEnv: (initialEnv) => set({ initialEnv }),
				setCurrentEnv: (currentEnv) => set({ currentEnv }),
				setChips: (chips) => set({ chips: Array.from(chips.entries()).map((a) => a[1]) }),
				setLoading: (loading) => set({ loading }),
				setInitialized: (initialized) => set({ initialized }),
				setBuilder: (builder) => set({ builder }),

				// Действия терминала
				addToTerminal: (message) =>
					set((state) => {
						console.debug(message);
						return {
							terminalOutput: [...state.terminalOutput, `> ${message}`],
						};
					}),

				clearTerminal: () => set({ terminalOutput: [] }),

				// IC10 операции
				initializeFromYaml: async (yaml: string) => {
					const { addToTerminal, setChips, forceUpdate } = get();
					try {
						set({ initialized: false, loading: true });

						const builder = ic10.Builer.from(yaml);
						await builder.init();
						set({
							currentEnv: builder.toYaml(),
							builder,
							initialized: true,
						});
						setChips(builder.Chips);

						// Обработка ошибок
						builder.Runners.forEach((runner) => {
							runner.realContext.reset();
							runner.sanboxContext.$errors.forEach((error) => {
								if (error) {
									addToTerminal(`[chip: ${runner.realContext.housing.id}] ${error.formated_message}`);
								}
							});
						});
						set({ loading: false });
					} catch (e) {
						if (e instanceof ic10.Ic10Error) {
							addToTerminal(e.formated_message);
						}
						console.warn(e);
						set({ loading: false, initialized: false });
					}
					forceUpdate();
				},

				step: async () => {
					const { builder, initialized, addToTerminal, setCurrentEnv, setInitialized, forceUpdate } = get();

					if (!builder || !initialized) {
						addToTerminal("Not initialized");
						return;
					}

					try {
						const end = await builder.step();
						if (end === false) {
							setInitialized(false);
						}
						const newEnv = builder.toYaml();
						setCurrentEnv(newEnv);

						// Обработка ошибок
						builder.Runners.forEach((runner) => {
							runner.realContext.$errors.forEach((error) => {
								if (error) {
									addToTerminal(`[chip: ${runner.realContext.housing.id}] ${error.formated_message}`);
								}
							});
						});
					} catch (e) {
						if (e instanceof ic10.Ic10Error) {
							addToTerminal(e.formated_message);
						}
						console.warn(e);
						setInitialized(false);
					}
					forceUpdate();
				},

				getCurrentEnv: () => {
					const { builder } = get();
					return builder?.toYaml();
				},
				getDebugEnv: () => {
					const { builder } = get();
					return builder?.toYaml();
				},
				getInitialEnv: () => {
					const { initialEnv } = get();
					return initialEnv;
				},
			}),
			{
				name: "ic10-storage", // имя ключа в localStorage
				partialize: (state) => ({
					// Сохраняем только initialEnv в localStorage
					initialEnv: state.initialEnv,
				}),
				// Опционально: миграция для будущих изменений структуры
				migrate: (persistedState: any, version: number) => {
					if (version === 0) {
						// Миграция с версии 0 на версию 1, если понадобится в будущем
						return persistedState;
					}
					return persistedState;
				},
				version: 1, // версия для миграций
			},
		),
	),
);
