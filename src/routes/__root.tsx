import { Box } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Menu from "./-menu";

export function TopMenu() {
	return (
		<>
			<Menu />

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
