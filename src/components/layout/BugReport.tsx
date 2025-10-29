// components/ui/BugReportButton.tsx
import { Box, Button, IconButton, Input, Portal, Textarea, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuBug, LuX } from "react-icons/lu";
import { useIc10Store } from "@/stores/ic10Store";
import { useInitialEnvStore } from "@/stores/initialEnvStore";
import { useTerminalStore } from "@/stores/terminalStore";
import { toaster } from "../chakra/toaster";

interface BugReportData {
	email: string;
	message: string;
	init_env: string;
	debug_env: string;
	terminal: string;
}

const WEBHOOK_URL = "https://n8n.traineratwot.site/webhook/b2f66dcc-a2a7-4ed1-9b2d-0261de8ca648";

const INITIAL_FORM_STATE: BugReportData = {
	email: "",
	message: "",
	init_env: "",
	debug_env: "",
	terminal: "",
};

export const BugReportButton = () => {
	const { t } = useTranslation();
	const { getTerminalOutput } = useTerminalStore();
	const { getDebugEnv } = useIc10Store();
	const { getInitialEnv } = useInitialEnvStore();

	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<BugReportData>(INITIAL_FORM_STATE);

	const toggleForm = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const closeForm = useCallback(() => {
		setIsOpen(false);
	}, []);

	const resetForm = useCallback(() => {
		setFormData(INITIAL_FORM_STATE);
	}, []);

	const showSuccessToast = useCallback(() => {
		toaster.create({
			title: t("bugReport.success.title"),
			description: t("bugReport.success.description"),
			type: "success",
			duration: 3000,
		});
	}, [t]);

	const showErrorToast = useCallback(() => {
		toaster.create({
			title: t("bugReport.error.title"),
			description: t("bugReport.error.description"),
			type: "error",
			duration: 3000,
		});
	}, [t]);

	const submitBugReport = useCallback(async (data: BugReportData): Promise<void> => {
		const response = await fetch(WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(t("bugReport.error.httpStatus"));
		}
	}, []);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setIsLoading(true);

			try {
				const dataToSubmit = {
					...formData,
					debug_env: getDebugEnv() ?? "",
					init_env: getInitialEnv() ?? "",
					terminal: getTerminalOutput().join("\n") ?? "",
				};

				await submitBugReport(dataToSubmit);

				showSuccessToast();
				resetForm();
				closeForm();
			} catch (error) {
				console.error("Failed to submit bug report:", error);
				showErrorToast();
			} finally {
				setIsLoading(false);
			}
		},
		[formData, getDebugEnv, getInitialEnv, submitBugReport, showSuccessToast, showErrorToast, resetForm, closeForm, t],
	);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const isSubmitDisabled = useMemo(() => {
		return isLoading || !formData.message.trim();
	}, [isLoading, formData.message]);

	return (
		<Portal>
			{/* Форма отчета */}
			{isOpen && (
				<Box
					position="fixed"
					bottom="100px"
					right="20px"
					width="350px"
					bg="white"
					boxShadow="2xl"
					borderRadius="lg"
					p={6}
					zIndex={1000}
					_dark={{ bg: "gray.800" }}
				>
					<Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
						<Box fontSize="lg" fontWeight="bold">
							{t("bugReport.title")}
						</Box>
						<IconButton
							aria-label={t("bugReport.close")}
							size="sm"
							variant="ghost"
							onClick={closeForm}
							disabled={isLoading}
						>
							<LuX />
						</IconButton>
					</Box>

					<form onSubmit={handleSubmit}>
						<VStack gap={4} align="stretch">
							<Box>
								<Box as="label" display="block" mb={2} fontSize="sm" fontWeight="medium">
									{t("bugReport.email")}{" "}
								</Box>
								<Input
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="your@email.com"
									disabled={isLoading}
								/>
							</Box>

							<Box>
								<Box as="label" display="block" mb={2} fontSize="sm" fontWeight="medium">
									{t("bugReport.message")}{" "}
									<Box as="span" color="red.500">
										*
									</Box>
								</Box>
								<Textarea
									name="message"
									value={formData.message}
									onChange={handleChange}
									placeholder={t("bugReport.messagePlaceholder")}
									rows={4}
									required
									disabled={isLoading}
								/>
							</Box>

							{/* Скрытые поля */}
							<input type="hidden" name="init_env" value={formData.init_env} />
							<input type="hidden" name="debug_env" value={formData.debug_env} />

							<Button type="submit" colorScheme="blue" width="full" loading={isLoading} disabled={isSubmitDisabled}>
								{t("bugReport.submit")}
							</Button>
						</VStack>
					</form>
				</Box>
			)}

			{/* Плавающая кнопка */}
			<IconButton
				aria-label={t("bugReport.reportBug")}
				position="fixed"
				bottom="20px"
				right="20px"
				size="lg"
				colorScheme="red"
				borderRadius="full"
				boxShadow="lg"
				zIndex={999}
				onClick={toggleForm}
			>
				<LuBug />
			</IconButton>
		</Portal>
	);
};
