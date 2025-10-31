import { useEffect } from "react";
import { useInitialEnvStore } from "@/stores/initialEnvStore";

export function UnLoad() {
	const hasChange = useInitialEnvStore((state) => state.hasChange);
	useEffect(() => {
		if (!hasChange) return; // Не добавляем слушатель, если нет изменений

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasChange]);
	return <> </>;
}
