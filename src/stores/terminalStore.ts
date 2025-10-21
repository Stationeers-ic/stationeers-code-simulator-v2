// stores/terminalStore.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface TerminalState {
	terminalOutput: string[];
	addToTerminal: (message: string) => void;
	clearTerminal: () => void;
}

export const useTerminalStore = create<TerminalState>()(
	devtools(
		persist(
			(set, _get) => ({
				terminalOutput: [],

				addToTerminal: (message: string) =>
					set((state) => {
						console.debug(message);
						return {
							terminalOutput: [...state.terminalOutput, `> ${message}`],
						};
					}),

				clearTerminal: () => set({ terminalOutput: [] }),
			}),
			{
				name: "terminal-storage",
				partialize: (state) => ({
					terminalOutput: state.terminalOutput,
				}),
				version: 1,
			},
		),
	),
);
