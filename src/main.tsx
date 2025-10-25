// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import { Provider } from "@/components/chakra/provider.tsx";
import LoadLang from "./components/lang/LoadLang";
import "@/assets/main.scss";
import { loader } from "@monaco-editor/react";
import registerLanguage from "monaco-lang-ic10";
import ictm from "@/assets/ic10.tm.json";
import { BugReportButton } from "./components/layout/BugReport";
import PWABadge from "./PWABadge";

loader
	.init()
	.then((monaco) => {
		registerLanguage(monaco);
		monaco.editor.defineTheme("ic10", ictm as any);
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
