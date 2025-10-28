import { Grid, GridItem } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import CodeStorages, { type StoredItem } from "@/core/CodeStorage.class";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/saves")({
	component: Saves,
});

function Saves() {
	const [saves, setSaves] = useState<StoredItem[]>([]);
	useEffect(() => {
		const stores = CodeStorages.map((storage) => storage.list());
		Promise.all(stores).then((results) => {
			let _saves: StoredItem[] = [];
			results.forEach((r: StoredItem[]) => {
				_saves = [..._saves, ...r];
			});
			setSaves(_saves);
		});
	}, []);
	return (
		<Grid templateColumns="repeat(6, 1fr)" gap={6} mb={6} w="100%" h="100%">
			<GridItem h="100%">
				{saves.map((s) => (
					<>{s.name}</>
				))}
			</GridItem>
			<GridItem h="100%">test2</GridItem>
			<GridItem h="100%" colSpan={4}>
				test3
			</GridItem>
		</Grid>
	);
}
