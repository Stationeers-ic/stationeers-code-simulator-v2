// stores/terminalStore.ts

import type { Ic10Error } from "@stationeers-ic/ic10";
import { create } from "zustand";
import signal from "@/Signal";

export interface TerminalEntry {
	id: string;
	timestamp: Date;
	type: 'error' | 'message';
	content: string;
	errorId?: number;
}

export interface TerminalState {
	entries: TerminalEntry[];
	errorIds: Set<number>;
	messages: Set<string>;
	
	addError: (error: Ic10Error) => void;
	addMessage: (message: string) => void;
	clearTerminal: () => void;
	getTerminalOutput: () => TerminalEntry[];
}

export const useTerminalStore = create<TerminalState>()((set, get) => ({
	entries: [],
	errorIds: new Set<number>(),
	messages: new Set<string>(),

	addError: (error: Ic10Error) => {
		const { errorIds, entries } = get();
		
		// Проверяем уникальность по error.id
		if (errorIds.has(error.id)) {
			return;
		}

		const newEntry: TerminalEntry = {
			id: `error-${error.id}-${Date.now()}`,
			timestamp: new Date(),
			type: 'error',
			content: error.formated_message,
			errorId: error.id,
		};

		set({
			entries: [...entries, newEntry],
			errorIds: new Set([...errorIds, error.id]),
		});
		signal.emit("updateTerminal")
	},

	addMessage: (message: string) => {
		const { messages, entries } = get();
		
		// Проверяем уникальность по тексту
		if (messages.has(message)) {
			return;
		}

		const newEntry: TerminalEntry = {
			id: `message-${Date.now()}`,
			timestamp: new Date(),
			type: 'message',
			content: `> ${message}`,
		};

		set({
			entries: [...entries, newEntry],
			messages: new Set([...messages, message]),
		});
		signal.emit("updateTerminal")
	},

	clearTerminal: () =>{ 
		set({ 
		entries: [], 
		errorIds: new Set(), 
		messages: new Set() 
	})
	signal.emit("updateTerminal")
},

	getTerminalOutput: () => {
		// Возвращаем отсортированные по времени записи
		return get().entries.sort((a, b) => 
			a.timestamp.getTime() - b.timestamp.getTime()
		);
	},
}));