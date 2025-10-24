// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "@/components/chakra/provider.tsx";
import LoadLang from "./components/lang/LoadLang";
import "@/assets/main.scss";
import { BugReportButton } from "./components/ui/BugReport";
import PWABadge from "./PWABadge";

import { loader } from "@monaco-editor/react";
import { conf, language } from "monaco-lang-ic10";

loader
	.init()
	.then((monaco) => {
		monaco.languages.register({ id: "ic10" });
		monaco.languages.setMonarchTokensProvider("ic10", language);
		monaco.languages.setLanguageConfiguration("ic10", conf);
	})
	.then(() => {
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
	});
