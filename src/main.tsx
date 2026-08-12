import { loader } from "@monaco-editor/react";
import registerLanguage from "@stationeers-ic/monaco-lang-ic10";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ictm from "@/assets/ic10.tm.json";
import { Provider } from "@/components/chakra/provider.tsx";
import { Toaster } from "@/components/chakra/toaster";
import LoadLang from "@/components/lang/LoadLang";
import PWABadge from "@/PWABadge";
import signal from "@/Signal";
import "@/assets/main.scss";
import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { UnLoad } from "@/components/layout/UnLoad";
import { routeTree } from "@/routeTree.gen";
import { getInitialLanguage } from "@/stores/languageStore";

const hashHistory = createHashHistory();
// Create a new router instance
const router = createRouter({ routeTree, history: hashHistory });

declare global {
	interface Window {
		signal: typeof signal;
	}
}

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const lang = getInitialLanguage();
window.signal = signal;
loader.config({
	// monaco:monaco,
	// paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs' },
	"vs/nls": {
		availableLanguages: {
			"*": lang,
		},
	},
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
					<PWABadge />
					<UnLoad />
					<RouterProvider router={router} />
				</StrictMode>
			</Provider>,
		);
	});
