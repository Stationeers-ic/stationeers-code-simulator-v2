import { Box, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuSaveAll, LuSettings, LuStar } from "react-icons/lu";
import Docs from "@/components/layout/Docs";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import MenuLink from "@/components/ui/MenuLink";

function Menu() {
	const { t } = useTranslation();

	return (
		<Box className="menu" bg="gray.800" px={4} py={3} borderBottom="1px solid" borderColor="gray.700" height="61px">
			<HStack justify="space-between">
				<HStack gap={3}>
					<MenuLink to="/">
						<LuStar />
						{t("menu.projects")}
					</MenuLink>
					<Docs />
					<MenuLink to="/editor">
						<LuSaveAll />
						{t("menu.editor")}
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
	);
}

export default Menu;
