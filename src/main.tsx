import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "@/components/chakra/provider.tsx";
import { Loading } from "./components/chakra/Loading";
import LoadLang from "./components/lang/LoadLang";
import "@/assets/main.scss";
import { BugReportButton } from "./components/ui/BugReport";

createRoot(document.getElementById("root")!).render(
	<Provider>
		<StrictMode>
			<Suspense fallback={<Loading />}>
				<LoadLang />
				<App />
				<BugReportButton />
			</Suspense>
		</StrictMode>
	</Provider>,
);
