import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		tsconfigPaths(),
		VitePWA({
			registerType: "prompt",
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				display: "standalone",
				name: "Stationeers Code Simulator",
				short_name: "Ic10",
				description:
					"Stationeers Code Simulator (SCS) provides a simulation of the IC10. IDE with devices, slots, networks, error checking, full visibility of stack and registers.",
				theme_color: "#ffffff",
				background_color: "#062845",
				lang: "en",
			},

			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
			},

			devOptions: {
				enabled: false,
				navigateFallback: "index.html",
				suppressWarnings: true,
				type: "module",
			},
		}),
		// Кастомный плагин для добавления скрипта
		{
			name: "html-transform",
			transformIndexHtml(html) {
				if (process.env.NODE_ENV === "production") {
					return html.replace(
						"</body>",
						'<script defer data-domain="beta.ic10.dev" src="https://thor.traineratwot.site/js/script.hash.js"></script></body>',
					);
				}
				return html;
			},
		},
	],
	build: {
		chunkSizeWarningLimit: 1024,
		rollupOptions: {
			output: {
				manualChunks(id) {
					const pkgName = (id.match(/node_modules\/([^/]+)/) ?? [])[1];
					// also split organizetion packages
					if (pkgName?.startsWith("@")) {
						const scopePkgName = (id.match(/node_modules\/(@[^/]+\/[^/]+)/) ?? [])[1];
						// also further split @stationeers-ic/ic10
						if (scopePkgName === "@stationeers-ic/ic10") {
							const ic10 = (id.match(/node_modules\/@stationeers-ic\/ic10\/(.+)$/) ?? [])[1];
							// rearly changes
							if (ic10.startsWith("dist/Devices")) return `vendor-@stationeers-ic_ic10_devices`;
							// largest file
							if (ic10 === "dist/Defines/devices.js") return `vendor-@stationeers-ic_ic10_defines_devices`;
							// rearly changes
							if (ic10.startsWith("dist/Defines")) return `vendor-@stationeers-ic_ic10_defines`;

							return "vendor-@stationeers-ic_ic10_base";
						}
						return `vendor-${scopePkgName.replace("/", "_")}`;
					}
					// also further split monaco-editor
					if (pkgName === "monaco-editor") {
						const monacoPkg = (id.match(/node_modules\/monaco-editor\/esm\/vs\/(.+)$/) ?? [])[1];
						if (monacoPkg.startsWith("language")) return "vendor-monaco-editor_language";
						if (monacoPkg.startsWith("basic-languages")) return "vendor-monaco-editor_basic-languages";
						if (monacoPkg.startsWith("platform")) return "vendor-monaco-editor_platform";
						if (monacoPkg.startsWith("base/common")) return "vendor-monaco-editor_base2";
						if (monacoPkg.startsWith("base")) return "vendor-monaco-editor_base1";

						if (monacoPkg.startsWith("editor/contrib")) return "vendor-monaco-editor_editor_contrib";
						if (monacoPkg.startsWith("editor/standalone")) return "vendor-monaco-editor_editor_standalone";
						if (monacoPkg.startsWith("editor/browser")) return "vendor-monaco-editor_editor_browser";
						if (monacoPkg.startsWith("editor/common")) return "vendor-monaco-editor_editor_common";
						if (monacoPkg.startsWith("editor")) return "vendor-monaco-editor_editor";

						return "vendor-monaco-editor";
					}
					if (pkgName) return `vendor-${pkgName}`;
					return "vendor";
				},
			},
		},
	},
});
