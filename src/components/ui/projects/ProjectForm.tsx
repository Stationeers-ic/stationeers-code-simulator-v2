import {
	Box,
	Button,
	CloseButton,
	createToaster,
	FileUpload,
	Grid,
	GridItem,
	HStack,
	Input,
	InputGroup,
	TagsInput,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import type { EnvSchema } from "@stationeers-ic/ic10";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuFileUp } from "react-icons/lu";
import Field from "@/components/ui/field";
import { JsonSchemaEditor } from "@/components/ui/JsonSchemaEditor";
import { useEnvSchema } from "@/hooks/useJsonSchema";

export interface ProjectFormData {
	name: string;
	author?: string;
	description?: string;
	version?: string;
	tags?: string[];
	env?: string;
}

export interface ProjectFormProps {
	onSubmit: (data: ProjectFormData) => void;
}

const semVerPattern =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

const toaster = createToaster({
	placement: "top-end",
	pauseOnPageIdle: true,
});

export const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
	const { schema, schemaUri } = useEnvSchema();
	const { t } = useTranslation();

	const [formData, _setFormData] = useState<ProjectFormData>({
		name: "",
		author: "",
		description: "",
		version: "",
		tags: [],
		env: "",
	});
	const setFormData = (data: ProjectFormData) => {
		if (data?.env) {
			try {
				const env = JSON.parse(data.env) as EnvSchema;
				if (typeof env.project === "undefined") {
					env.project = {};
				}
				env.project.name = data.name || undefined;
				env.project.version = data.version || undefined;
				env.project.author = data.author || undefined;
				env.project.description = data.description || undefined;
				if (typeof data.tags !== "undefined" && data.tags.length > 0) {
					env.project.tags = data.tags || undefined;
				}
				data.env = JSON.stringify(env, null, 2);
			} catch (e) {}
		}
		_setFormData(data);
	};

	const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

		if (!formData.name || formData.name.trim().length === 0) {
			newErrors.name = t("projectForm.errors.nameRequired");
		}

		if (formData.version && !semVerPattern.test(formData.version)) {
			newErrors.version = t("projectForm.errors.versionInvalid");
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			const submitData: ProjectFormData = {
				name: formData.name,
				...(formData.author && { author: formData.author }),
				...(formData.description && { description: formData.description }),
				...(formData.version && { version: formData.version }),
				...(formData.tags && formData.tags.length > 0 && { tags: formData.tags }),
				...(formData.env && { env: formData.env }),
			};

			onSubmit(submitData);
		}
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				setFormData({ ...formData, env: content });
				toaster.create({
					title: t("projectForm.fileUpload.success"),
					description: t("projectForm.fileUpload.description", { fileName: file.name }),
					type: "success",
					duration: 3000,
				});
			};
			reader.readAsText(file);
		}
	};

	return (
		<Box asChild>
			<form onSubmit={handleSubmit}>
				<Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
					{/* Left Column - Basic Information */}
					<GridItem>
						<VStack gap={4} align="stretch">
							{/* Name Field */}
							<Field
								label={t("projectForm.fields.name.label")}
								required
								invalid={!!errors.name}
								errorText={errors.name}
							>
								<Input
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder={t("projectForm.fields.name.placeholder")}
									size="md"
								/>
							</Field>

							{/* Author Field */}
							<Field label={t("projectForm.fields.author.label")}>
								<Input
									value={formData.author}
									onChange={(e) => setFormData({ ...formData, author: e.target.value })}
									placeholder={t("projectForm.fields.author.placeholder")}
									size="md"
								/>
							</Field>

							{/* Version Field */}
							<Field
								label={t("projectForm.fields.version.label")}
								invalid={!!errors.version}
								errorText={errors.version}
							>
								<Input
									value={formData.version}
									onChange={(e) => setFormData({ ...formData, version: e.target.value })}
									placeholder={t("projectForm.fields.version.placeholder")}
									size="md"
								/>
							</Field>

							{/* Description Field */}
							<Field label={t("projectForm.fields.description.label")}>
								<Textarea
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									placeholder={t("projectForm.fields.description.placeholder")}
									rows={5}
									height={"140px"}
								/>
							</Field>

							{/* Tags Field */}
							<Field label={t("projectForm.fields.tags.label")}>
								<TagsInput.Root
									value={formData.tags}
									onValueChange={(details) =>
										setFormData({
											...formData,
											tags: details.value,
										})
									}
								>
									<TagsInput.Control>
										<TagsInput.Items />
										<TagsInput.Input placeholder={t("projectForm.fields.tags.placeholder")} />
									</TagsInput.Control>
								</TagsInput.Root>
							</Field>
						</VStack>
					</GridItem>

					{/* Right Column - Environment Configuration */}
					<GridItem>
						<VStack gap={4} align="stretch" h="full">
							{/* File Upload */}
							<Field label={t("projectForm.fields.envFile.label")}>
								<FileUpload.Root
									gap="1"
									onChange={handleFileUpload}
									accept={["application/json", "text/*"]}
									maxFileSize={1024 * 1024 * 10}
								>
									<FileUpload.HiddenInput />
									<InputGroup
										startElement={<LuFileUp />}
										endElement={
											<FileUpload.ClearTrigger asChild>
												<CloseButton
													me="-1"
													size="xs"
													variant="plain"
													focusVisibleRing="inside"
													focusRingWidth="2px"
													pointerEvents="auto"
												/>
											</FileUpload.ClearTrigger>
										}
									>
										<Input asChild>
											<FileUpload.Trigger>
												<FileUpload.FileText lineClamp={1} />
											</FileUpload.Trigger>
										</Input>
									</InputGroup>
								</FileUpload.Root>
							</Field>

							{/* Environment Variables Textarea */}
							<Field label={t("projectForm.fields.envVariables.label")} required>
								<JsonSchemaEditor
									value={formData.env || ""}
									onChange={(value) => setFormData({ ...formData, env: value })}
									height={"400px"}
									schema={schema}
									schemaUri={schemaUri}
								/>
							</Field>
						</VStack>
					</GridItem>

					{/* Action Buttons - Full Width */}
					<GridItem colSpan={{ base: 1, md: 2 }}>
						<HStack gap={3} justify="flex-end" pt={4} borderTop="1px solid" borderColor="gray.200">
							<Button type="submit" colorPalette="blue" size="md" px={8}>
								{t("projectForm.actions.submit")}
							</Button>
						</HStack>
					</GridItem>
				</Grid>
			</form>
		</Box>
	);
};
