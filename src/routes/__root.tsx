import { Box, HStack } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";
import { LuSaveAll, LuSettings, LuStar } from "react-icons/lu";
import Docs from "@/components/layout/Docs";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import MenuLink from "@/components/ui/MenuLink";

export function TopMenu() {
	const { t } = useTranslation();

	return (
		<>
			<Box className="menu" bg="gray.800" px={4} py={3} borderBottom="1px solid" borderColor="gray.700" height="61px">
				<HStack justify="space-between">
					<HStack gap={3}>
						<MenuLink to="/">
							<LuStar />
							{t("menu.main")}
						</MenuLink>
						<Docs />
						<MenuLink to="/saves">
							<LuSaveAll />
							{t("menu.saves")}
						</MenuLink>
						<MenuLink to="/settings">
							<LuSettings />
							{t("menu.settings")}
						</MenuLink>
					</HStack>
					<HStack gap={3}>
						<LanguageSelector />
					</HStack>
				</HStack>
			</Box>

			<Box p={3}>
				<Box className="outlet" h="calc(100vh - 61px - (var(--chakra-spacing-3) * 2 ))">
					<Outlet />
				</Box>
			</Box>
			<TanStackRouterDevtools />
		</>
	);
}

export const Route = createRootRoute({ component: TopMenu });
