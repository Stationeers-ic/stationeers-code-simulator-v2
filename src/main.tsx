// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "@/components/chakra/provider.tsx";
import LoadLang from "./components/lang/LoadLang";
import "@/assets/main.scss";
import { BugReportButton } from "./components/ui/BugReport";
import PWABadge from "./PWABadge";

createRoot(document.getElementById("root")!).render(
	<Provider>
		<StrictMode>
			<LoadLang />
			<App />
			<BugReportButton />
			<PWABadge />
		</StrictMode>
	</Provider>,
);
