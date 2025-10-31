import { Box, Portal, Spinner } from "@chakra-ui/react";

export function Loading() {
	return (
		<Portal>
			<Box
				width="100vw"
				height="100vh"
				display="flex"
				position="absolute"
				alignItems="center"
				justifyContent="center"
				bg="transparent"
			>
				<Spinner size="xl" color="blue.500" />
			</Box>
		</Portal>
	);
}
