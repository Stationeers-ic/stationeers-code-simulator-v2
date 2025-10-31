import type { Builer } from "@stationeers-ic/ic10";
import EventEmitter from "eventemitter3";

export interface Signals {
	step(builer: Builer): void;
	init(builer: Builer): void;
	updateTerminal(): void;
	projectDeleted(name: string): void;
}

class Signal extends EventEmitter<Signals> {
	private static instance: Signal;

	private constructor() {
		super();
	}

	public static getInstance(): Signal {
		if (!Signal.instance) {
			Signal.instance = new Signal();
		}
		return Signal.instance;
	}
}

// Использование:
const signal = Signal.getInstance();
export default signal;
