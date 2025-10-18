import { i18n } from "ic10";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "@/components/chakra/provider.tsx";
import { Loading } from "./components/chakra/Loading";

i18n.init().then(() => {
	createRoot(document.getElementById("root")!).render(
		<Provider>
			<StrictMode>
				<Suspense fallback={<Loading />}>
					<App />
				</Suspense>
			</StrictMode>
		</Provider>,
	);
});
