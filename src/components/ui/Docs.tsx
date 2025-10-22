import { Box, CloseButton, Drawer, IconButton, Portal } from "@chakra-ui/react";
import ReactHighlightSyntax from "react-highlight-syntax";
import { LuDock } from "react-icons/lu";
import Markdown from "react-markdown";

import doc from "../../../../ic10/docs/ru/env.md?raw";

function Docs() {
	return (
		<Portal>
			<Drawer.Root size="xl">
				<Drawer.Backdrop />
				<Drawer.Trigger asChild>
					<IconButton
						aria-label="Сообщить об ошибке"
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
