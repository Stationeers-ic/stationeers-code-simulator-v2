import { useIc10Store } from "@/stores/ic10Store";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useTerminalStore } from "@/stores/terminalStore";

export function useInitIc10() {
	const { getInitialEnv } = useInitialEnvStore();
	const { initializeFromYaml } = useIc10Store();
	const { clearTerminal } = useTerminalStore();
	const init = () => {
		clearTerminal();
		initializeFromYaml(getInitialEnv());
	};

	return {
		init,
	};
}
