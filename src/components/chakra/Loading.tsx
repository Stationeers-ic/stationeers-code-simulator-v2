import { Box, Spinner } from "@chakra-ui/react";

export function Loading() {
	return (
		<Box width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center" bg="transparent">
			<Spinner size="xl" color="blue.500" />
		</Box>
	);
}
