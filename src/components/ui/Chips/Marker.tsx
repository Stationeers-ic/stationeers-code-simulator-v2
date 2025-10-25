import { Box } from "@chakra-ui/react";
import type { ChipSchema } from "ic10";

type MarkerProps = {
	chip: ChipSchema;
};

export default function Marker({ chip }: MarkerProps) {
	return (
		<Box className="maker">
			<span className="line"></span>
		</Box>
	);
}
