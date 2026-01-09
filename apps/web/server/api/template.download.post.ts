import JSZip from "jszip";
import type { TemplateConfig } from "../../shared/types/template";
import { useTemplateGenerator } from "../../app/composables/core/useTemplateGenerator";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody<TemplateConfig>(event);

		if (!body.ecosystem || !body.libraries) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid template configuration",
			});
		}

		const { generateTemplate } = useTemplateGenerator();
		const template = generateTemplate(body);

		const zip = new JSZip();

		template.files.forEach((file: any) => {
			zip.file(file.path, file.content);
		});

		const buffer = await zip.generateAsync({ type: "nodebuffer" });

		setHeader(event, "Content-Type", "application/zip");
		setHeader(event, "Content-Disposition", `attachment; filename="template-${body.ecosystem}.zip"`);

		return buffer;
	} catch {
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to generate template",
		});
	}
});
