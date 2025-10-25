// components/ui/Docs.tsx
import { Box, Button, CloseButton, Drawer, Portal, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuDock } from "react-icons/lu";
import Markdown from "react-markdown";
import CodeViewer from "@/components/ui/CodeViewer";
import { useLanguageStore } from "@/stores/languageStore";

function Docs() {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguageStore();
	const [doc, setDoc] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDoc = async () => {
			setLoading(true);
			setError(null);
			try {
				const url = `https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/docs/${currentLanguage}/env.md`;
				const response = await fetch(url);
				if (!response.ok) throw new Error(t("docs.notFound"));
				const text = await response.text();
				setDoc(text);
			} catch (err: any) {
				setError(err.message || t("docs.error"));
				setDoc("");
			} finally {
				setLoading(false);
			}
		};
		fetchDoc();
	}, [currentLanguage]);

	return (
		<Drawer.Root size="xl">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>
				<Button>
					<LuDock />
					{t("docs.title")}
				</Button>
			</Drawer.Trigger>
			<Portal>
				<Drawer.Positioner>
					<Drawer.Content>
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Drawer.CloseTrigger>
						<Drawer.Header>
							<Drawer.Title>{t("docs.title")}</Drawer.Title>
						</Drawer.Header>
						<Drawer.Body>
							<Box overflow="true" maxH={"100%"}>
								{loading ? (
									<Spinner size="lg" />
								) : error ? (
									<Text color="red.500">{error}</Text>
								) : (
									<Markdown
										components={{
											code(props) {
												const { children, className } = props;
												const match = /language-(\w+)/.exec(className || "");
												if (match) {
													console.log(match);
													const language = match[1].toLowerCase();
													const codeString = String(children).replace(/\n$/, "");
													const lineCount = codeString.split("\n").length;
													const height = lineCount * 19 + 19; // 19px per line
													return <CodeViewer language={language} data={codeString} height={height} />;
												}
											},
										}}
									>
										{doc}
									</Markdown>
								)}
							</Box>
						</Drawer.Body>
						<Drawer.Footer />
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
}

export default Docs;
