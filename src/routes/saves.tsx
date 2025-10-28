import { Grid, GridItem } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/saves")({
	component: Saves,
});

function Saves() {
	return (
		<Grid templateColumns="repeat(6, 1fr)" gap={6} mb={6} w="100%" h="100%">
			<GridItem h="100%">test</GridItem>
			<GridItem h="100%">test2</GridItem>
			<GridItem h="100%" colSpan={4}>
				test3
			</GridItem>
		</Grid>
	);
}
