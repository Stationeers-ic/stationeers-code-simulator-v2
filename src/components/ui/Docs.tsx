import { Box, CloseButton, Drawer, IconButton, Portal, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactHighlightSyntax from "react-highlight-syntax";
import { LuDock } from "react-icons/lu";
import Markdown from "react-markdown";
import { useLanguageStore } from "@/stores/languageStore";

function Docs() {
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
				if (!response.ok) throw new Error("Документация не найдена");
				const text = await response.text();
				setDoc(text);
			} catch (err: any) {
				setError(err.message || "Ошибка загрузки");
				setDoc("");
			} finally {
				setLoading(false);
			}
		};
		fetchDoc();
	}, [currentLanguage]);

	return (
		<Portal>
			<Drawer.Root size="xl">
				<Drawer.Backdrop />
				<Drawer.Trigger asChild>
					<IconButton
						aria-label="Открыть документацию"
						position="fixed"
						bottom="20px"
						left="20px"
						size="lg"
						colorScheme="red"
						borderRadius="full"
						boxShadow="lg"
						zIndex={999}
					>
						<LuDock />
					</IconButton>
				</Drawer.Trigger>
				<Drawer.Positioner>
					<Drawer.Content>
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Drawer.CloseTrigger>
						<Drawer.Header>
							<Drawer.Title>Docs</Drawer.Title>
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
												const { children, className, node, ...rest } = props;
												const match = /language-(\w+)/.exec(className || "");
												return match ? (
													<ReactHighlightSyntax theme={"Base16Darcula"} language={match[1] as any} copy={true}>
														{String(children).replace(/\n$/, "")}
													</ReactHighlightSyntax>
												) : (
													<code {...rest} className={className}>
														{children}
													</code>
												);
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
			</Drawer.Root>
		</Portal>
	);
}

export default Docs;
