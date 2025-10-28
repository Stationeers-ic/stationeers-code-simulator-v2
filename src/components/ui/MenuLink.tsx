import { Button, type ButtonProps } from "@chakra-ui/react";
import { Link, type LinkProps, useMatchRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

type MenuLinkProps = LinkProps & {
	children: ReactNode;
	buttonProps?: Omit<ButtonProps, "children">;
};

export default function MenuLink({ children, buttonProps, ...linkProps }: MenuLinkProps) {
	const matchRoute = useMatchRoute();
	const isActive = !!matchRoute({ to: linkProps.to, fuzzy: false });

	return (
		<Link {...linkProps}>
			<Button size="sm" colorScheme="blue" variant={isActive ? "surface" : "solid"} {...buttonProps}>
				{children}
			</Button>
		</Link>
	);
}
