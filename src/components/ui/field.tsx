// components/ui/field.tsx
import { Box, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface FieldProps {
	label: string;
	children: ReactNode;
	required?: boolean;
	invalid?: boolean;
	errorText?: string;
}

export const Field = ({ label, children, required, invalid, errorText }: FieldProps) => {
	return (
		<Box>
			<Text fontWeight="medium" mb={2}>
				{label}
				{required && (
					<Text as="span" color="red.500" ml={1}>
						*
					</Text>
				)}
			</Text>
			{children}
			{invalid && errorText && (
				<Text color="red.500" fontSize="sm" mt={1}>
					{errorText}
				</Text>
			)}
		</Box>
	);
};

export default Field;
