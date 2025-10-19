import { Box, Button, createToaster, IconButton, Input, Portal, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { LuBug, LuX } from "react-icons/lu";
import { useIc10Store } from "@/stores/ic10Store";

interface BugReportData {
	email: string;
	message: string;
	init_env: string;
	debug_env: string;
}

const toaster = createToaster({
	placement: "top-end",
	pauseOnPageIdle: true,
});

export const BugReportButton = () => {
	const { initialEnv, getCurrentEnv } = useIc10Store();
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<BugReportData>({
		email: "",
		message: "",
		init_env: initialEnv,
		debug_env: getCurrentEnv(true) ?? "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			formData.debug_env = getCurrentEnv(true) ?? "";
			formData.init_env = initialEnv;
			const response = await fetch("https://n8n.traineratwot.site/webhook-test/b2f66dcc-a2a7-4ed1-9b2d-0261de8ca648", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				toaster.create({
					title: "Успешно отправлено",
					description: "Спасибо за ваш отчет об ошибке!",
					type: "success",
					duration: 3000,
				});
				setFormData({
					email: "",
					message: "",
					init_env: "",
					debug_env: "",
				});
				setIsOpen(false);
			} else {
				throw new Error("Ошибка отправки");
			}
		} catch (error) {
			toaster.create({
				title: "Ошибка",
				description: "Не удалось отправить отчет. Попробуйте позже.",
				type: "error",
				duration: 3000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

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
							Сообщить об ошибке
						</Box>
						<IconButton aria-label="Закрыть" size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
							<LuX />
						</IconButton>
					</Box>

					<form onSubmit={handleSubmit}>
						<VStack gap={4} align="stretch">
							<Box>
								<Box as="label" display="block" mb={2} fontSize="sm" fontWeight="medium">
									Email{" "}
								</Box>
								<Input
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="your@email.com"
								/>
							</Box>

							<Box>
								<Box as="label" display="block" mb={2} fontSize="sm" fontWeight="medium">
									Сообщение{" "}
									<Box as="span" color="red.500">
										*
									</Box>
								</Box>
								<Textarea
									name="message"
									value={formData.message}
									onChange={handleChange}
									placeholder="Опишите проблему..."
									rows={4}
									required
								/>
							</Box>

							{/* Скрытые поля */}
							<input type="hidden" name="init_env" value={formData.init_env} />
							<input type="hidden" name="debug_env" value={formData.debug_env} />

							<Button type="submit" colorScheme="blue" width="full" loading={isLoading}>
								Отправить
							</Button>
						</VStack>
					</form>
				</Box>
			)}

			{/* Плавающая кнопка */}
			<IconButton
				aria-label="Сообщить об ошибке"
				position="fixed"
				bottom="20px"
				right="20px"
				size="lg"
				colorScheme="red"
				borderRadius="full"
				boxShadow="lg"
				zIndex={999}
				onClick={() => setIsOpen(!isOpen)}
			>
				<LuBug />
			</IconButton>
		</Portal>
	);
};
