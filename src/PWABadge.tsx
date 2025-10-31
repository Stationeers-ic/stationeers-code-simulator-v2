/** biome-ignore-all lint/correctness/useUniqueElementIds: <pwa> */
/** biome-ignore-all lint/a11y/useButtonType: <pwa> */

import { useRegisterSW } from "virtual:pwa-register/react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toaster } from "@/components/chakra/toaster";

function PWABadge() {
	const { t } = useTranslation();
	// check for updates every hour
	const period = 60 * 60 * 1000;

	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(swUrl, r) {
			if (period <= 0) return;
			if (r?.active?.state === "activated") {
				registerPeriodicSync(period, swUrl, r);
			} else if (r?.installing) {
				r.installing.addEventListener("statechange", (e) => {
					const sw = e.target as ServiceWorker;
					if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
				});
			}
		},
	});

	useEffect(() => {
		if (offlineReady) {
			toaster.create({
				title: t("pwa.app-ready-to-work-offline"),
				type: "success",
				duration: 5000,
			});
			setOfflineReady(false);
		}
	}, [offlineReady, setOfflineReady]);

	useEffect(() => {
		if (needRefresh) {
			toaster.create({
				title: t("pwa.update-available"),
				description: (
					<Box>
						<Text mb={3}>{t("pwa.new-content-available-click-reload-to-update")}</Text>
						<HStack gap={2}>
							<Button
								size="sm"
								colorPalette="blue"
								onClick={() => {
									updateServiceWorker(true);
									toaster.dismiss();
								}}
							>
								{t("pwa.reload")}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									setNeedRefresh(false);
									toaster.dismiss();
								}}
							>
								{t("pwa.close")}
							</Button>
						</HStack>
					</Box>
				),
				type: "info",
				duration: 100000, // не закрывается автоматически
			});
		}
	}, [needRefresh, setNeedRefresh, updateServiceWorker]);

	return null;
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
	if (period <= 0) return;

	setInterval(async () => {
		if ("onLine" in navigator && !navigator.onLine) return;

		const resp = await fetch(swUrl, {
			cache: "no-store",
			headers: {
				cache: "no-store",
				"cache-control": "no-cache",
			},
		});

		if (resp?.status === 200) await r.update();
	}, period);
}
