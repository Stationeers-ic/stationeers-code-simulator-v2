import { Button, HStack, Popover, Portal } from "@chakra-ui/react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmButtonProps {
	children: ReactElement;
	onConfirm: () => void;
	confirmMessage: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
}

export function ConfirmButton({
	children,
	onConfirm,
	confirmMessage,
	confirmButtonText,
	cancelButtonText,
}: ConfirmButtonProps) {
	const { t } = useTranslation();

	return (
		<Popover.Root positioning={{ sameWidth: true }}>
			<Popover.Trigger asChild>{children}</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Body>{confirmMessage}</Popover.Body>
						<Popover.Footer>
							<HStack justifyContent="flex-end" gap={2}>
								<Popover.CloseTrigger asChild>
									<Button variant="outline" size="sm">
										{cancelButtonText || t("common.cancel")}
									</Button>
								</Popover.CloseTrigger>
								<Button colorScheme="red" size="sm" onClick={onConfirm}>
									{confirmButtonText || t("common.continue")}
								</Button>
							</HStack>
						</Popover.Footer>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}

export default ConfirmButton;
