// components/ui/dialog.tsx (если еще нет)
import { Dialog as ChakraDialog, CloseButton } from "@chakra-ui/react";
import { forwardRef } from "react";

export const DialogRoot = ChakraDialog.Root;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogContent = ChakraDialog.Content;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogFooter = ChakraDialog.Footer;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;

export const DialogCloseTrigger = forwardRef<HTMLButtonElement, ChakraDialog.CloseTriggerProps>(
	function DialogCloseTrigger(props, ref) {
		return (
			<ChakraDialog.CloseTrigger position="absolute" top="2" insetEnd="2" {...props} ref={ref} asChild>
				<CloseButton size="sm" />
			</ChakraDialog.CloseTrigger>
		);
	},
);
