import { loader } from "@monaco-editor/react";
import registerLanguage from "@stationeers-ic/monaco-lang-ic10";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import ictm from "@/assets/ic10.tm.json";
import { Provider } from "@/components/chakra/provider.tsx";
import { Toaster } from "@/components/chakra/toaster";
import LoadLang from "@/components/lang/LoadLang";
import { BugReportButton } from "@/components/layout/BugReport";
import PWABadge from "@/PWABadge";
import signal from "@/Signal";
import "@/assets/main.scss";
import { getInitialLanguage } from "@/stores/languageStore";

declare global {
	interface Window {
		signal: typeof signal;
	}
}

const lang = getInitialLanguage();
console.log("Load lang :", lang)
window.signal = signal;
loader.config({ 
	// monaco:monaco,
	// paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs' },
    'vs/nls': {
        availableLanguages: { 
			'*': lang,
		 }
    }
	
 });
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
					<Toaster />
					<LoadLang />
					<App />
					<BugReportButton />
					<PWABadge />
				</StrictMode>
			</Provider>,
		);
	});