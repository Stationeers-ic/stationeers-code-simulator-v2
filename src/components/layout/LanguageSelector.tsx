// components/ui/LanguageSelector.tsx
import { Button, Menu, Portal } from "@chakra-ui/react";
import { useLanguageStore } from "@/stores/languageStore";

const languages = [
	{ code: "en", name: "English", flag: "🇬🇧" },
	{ code: "ru", name: "Русский", flag: "🇷🇺" },
];

export function LanguageSelector() {
	const { currentLanguage, setLanguage } = useLanguageStore();

	const changeLanguage = (lng: string) => {
		setLanguage(lng);
	};

	const selectedLanguage = languages.find((lang) => lang.code === currentLanguage) || languages[0];

	return (
		<Menu.Root>
			<Menu.Trigger asChild>
				<Button size="sm" variant="outline">
					{selectedLanguage.flag} {selectedLanguage.name}
				</Button>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						{languages.map((lang) => (
							<Menu.Item
								key={lang.code}
								value={lang.code}
								onClick={() => changeLanguage(lang.code)}
								bg={currentLanguage === lang.code ? "blue.500" : undefined}
							>
								{lang.flag} {lang.name}
							</Menu.Item>
						))}
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
}
