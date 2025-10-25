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
	],
	// Добавьте эту секцию для разделения бандла
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					const pkgName = (id.match(/node_modules\/([^/]+)/) ?? [])[1];
					if (pkgName) return `vendor-${pkgName}`;
					return "vendor";
				},
			},
		},
	},
});
