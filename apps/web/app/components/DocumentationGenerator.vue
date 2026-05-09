<script setup lang="ts">
import type { TemplateConfig, DocumentationConfig } from "#shared/types/template";
import { useDocumentationGenerator } from "~/composables/core/useDocumentationGenerator";

const props = defineProps<{
	templateConfig: TemplateConfig;
}>();

const emit = defineEmits<{
	generated: [files: Array<{ path: string; content: string }>];
}>();

const {
	generateDocumentation,
	generateApiDocs,
	generateDeploymentGuide,
} = useDocumentationGenerator();

const showDocPanel = ref(false);
const isGenerating = ref(false);
const generatedFiles = ref<Array<{ path: string; content: string }>>([]);

const docConfig = ref<DocumentationConfig>({
	includeReadme: true,
	includeChangelog: true,
	includeContributing: true,
	includeLicense: true,
	customSections: [],
});

const showAddSectionDialog = ref(false);
const newSectionTitle = ref("");
const newSectionContent = ref("");

const handleGenerate = () => {
	isGenerating.value = true;

	try {
		const files = generateDocumentation(props.templateConfig, docConfig.value);
		generatedFiles.value = files.map((f) => ({
			path: f.path,
			content: f.content,
		}));

		emit("generated", generatedFiles.value);
	} catch (error) {
		console.error("Failed to generate documentation:", error);
	} finally {
		isGenerating.value = false;
	}
};

const handleAddCustomSection = () => {
	if (!newSectionTitle.value.trim() || !newSectionContent.value.trim()) return;

	docConfig.value.customSections = [
		...(docConfig.value.customSections || []),
		{
			title: newSectionTitle.value,
			content: newSectionContent.value,
		},
	];

	newSectionTitle.value = "";
	newSectionContent.value = "";
	showAddSectionDialog.value = false;
};

const handleRemoveSection = (index: number) => {
	docConfig.value.customSections?.splice(index, 1);
};

const handleDownloadFile = (file: { path: string; content: string }) => {
	const blob = new Blob([file.content], { type: "text/markdown" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = file.path;
	a.click();
	URL.revokeObjectURL(url);
};

const handleDownloadAll = () => {
	generatedFiles.value.forEach((file) => {
		handleDownloadFile(file);
	});
};

const handleAddApiDocs = () => {
	const apiDocs = generateApiDocs(props.templateConfig);
	generatedFiles.value.push({
		path: apiDocs.path,
		content: apiDocs.content,
	});
};

const handleAddDeploymentGuide = () => {
	const deployGuide = generateDeploymentGuide(props.templateConfig);
	generatedFiles.value.push({
		path: deployGuide.path,
		content: deployGuide.content,
	});
};
</script>

<template>
	<div class="docs-panel">
		<div class="docs-header">
			<h3 class="text-lg font-semibold">Documentation Generator</h3>
			<button
				@click="showDocPanel = !showDocPanel"
				class="toggle-btn"
			>
				{{ showDocPanel ? "Hide" : "Show" }} Panel
			</button>
		</div>

		<div v-if="showDocPanel" class="docs-content">
			<div class="config-section">
				<h4 class="section-title">Documentation Options</h4>
				<div class="options-grid">
					<label class="option-item">
						<input
							v-model="docConfig.includeReadme"
							type="checkbox"
							class="option-checkbox"
						/>
						<span class="option-label">README.md</span>
					</label>

					<label class="option-item">
						<input
							v-model="docConfig.includeChangelog"
							type="checkbox"
							class="option-checkbox"
						/>
						<span class="option-label">CHANGELOG.md</span>
					</label>

					<label class="option-item">
						<input
							v-model="docConfig.includeContributing"
							type="checkbox"
							class="option-checkbox"
						/>
						<span class="option-label">CONTRIBUTING.md</span>
					</label>

					<label class="option-item">
						<input
							v-model="docConfig.includeLicense"
							type="checkbox"
							class="option-checkbox"
						/>
						<span class="option-label">LICENSE</span>
					</label>
				</div>

				<div class="custom-sections">
					<div class="custom-sections-header">
						<span class="custom-sections-title">Custom Sections</span>
						<button
							@click="showAddSectionDialog = true"
							class="add-section-btn"
						>
							<Icon name="mdi:plus" />
							Add Section
						</button>
					</div>

					<div v-if="docConfig.customSections && docConfig.customSections.length > 0" class="custom-sections-list">
						<div
							v-for="(section, index) in docConfig.customSections"
							:key="index"
							class="custom-section-item"
						>
							<span class="section-name">{{ section.title }}</span>
							<button
								@click="handleRemoveSection(index)"
								class="remove-section-btn"
							>
								<Icon name="mdi:close" />
							</button>
						</div>
					</div>
				</div>

				<button
					:disabled="isGenerating"
					@click="handleGenerate"
					class="generate-btn"
				>
					<Icon v-if="isGenerating" name="mdi:loading" class="animate-spin" />
					{{ isGenerating ? "Generating..." : "Generate Documentation" }}
				</button>
			</div>

			<div v-if="generatedFiles.length > 0" class="generated-section">
				<div class="generated-header">
					<h4 class="section-title">Generated Files</h4>
					<div class="generated-actions">
						<button
							@click="handleAddApiDocs"
							class="action-btn"
						>
							<Icon name="mdi:api" />
							Add API Docs
						</button>
						<button
							@click="handleAddDeploymentGuide"
							class="action-btn"
						>
							<Icon name="mdi:rocket-launch" />
							Add Deployment Guide
						</button>
						<button
							@click="handleDownloadAll"
							class="download-all-btn"
						>
							<Icon name="mdi:download" />
							Download All
						</button>
					</div>
				</div>

				<div class="files-list">
					<div
						v-for="(file, index) in generatedFiles"
						:key="index"
						class="file-item"
					>
						<div class="file-info">
							<Icon name="mdi:file-document" class="file-icon" />
							<span class="file-name">{{ file.path }}</span>
						</div>
						<div class="file-actions">
							<button
								@click="handleDownloadFile(file)"
								class="download-btn"
							>
								<Icon name="mdi:download" />
								Download
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Dialog v-model:open="showAddSectionDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Custom Section</DialogTitle>
				</DialogHeader>
				<div class="dialog-form">
					<div class="form-group">
						<label class="form-label">Section Title</label>
						<input
							v-model="newSectionTitle"
							type="text"
							class="form-input"
							placeholder="e.g., Architecture"
						/>
					</div>
					<div class="form-group">
						<label class="form-label">Section Content (Markdown)</label>
						<textarea
							v-model="newSectionContent"
							class="form-textarea"
							placeholder="Write your documentation content here..."
							rows="6"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" @click="showAddSectionDialog = false">
						Cancel
					</Button>
					<Button
						:disabled="!newSectionTitle.trim() || !newSectionContent.trim()"
						@click="handleAddCustomSection"
					>
						Add Section
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>

<style scoped>
.docs-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.docs-header {
	@apply mb-4 flex items-center justify-between;
}

.toggle-btn {
	@apply rounded-lg bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-primary/90;
}

.docs-content {
	@apply space-y-4;
}

.config-section {
	@apply space-y-4;
}

.section-title {
	@apply text-sm font-semibold text-gray-700;
}

.options-grid {
	@apply grid grid-cols-2 gap-3;
}

.option-item {
	@apply flex items-center gap-2 rounded-lg border border-gray-200 p-3;
}

.option-checkbox {
	@apply h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary;
}

.option-label {
	@apply text-sm font-medium text-gray-700;
}

.custom-sections {
	@apply space-y-2;
}

.custom-sections-header {
	@apply flex items-center justify-between;
}

.custom-sections-title {
	@apply text-sm font-semibold text-gray-700;
}

.add-section-btn {
	@apply flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary/90;
}

.custom-sections-list {
	@apply space-y-2;
}

.custom-section-item {
	@apply flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2;
}

.section-name {
	@apply text-sm font-medium text-gray-900;
}

.remove-section-btn {
	@apply rounded p-1 text-gray-600 hover:text-red-600 hover:bg-red-50;
}

.generate-btn {
	@apply flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-white font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed;
}

.generated-section {
	@apply space-y-3;
}

.generated-header {
	@apply flex items-center justify-between;
}

.generated-actions {
	@apply flex items-center gap-2;
}

.action-btn,
.download-all-btn {
	@apply flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary;
}

.download-all-btn {
	@apply bg-primary text-white hover:bg-primary/90 hover:border-primary hover:text-white;
}

.files-list {
	@apply space-y-2;
}

.file-item {
	@apply flex items-center justify-between rounded-lg border border-gray-200 p-3;
}

.file-info {
	@apply flex items-center gap-2;
}

.file-icon {
	@apply h-5 w-5 text-gray-600;
}

.file-name {
	@apply text-sm font-medium text-gray-900;
}

.file-actions {
	@apply flex gap-2;
}

.download-btn {
	@apply flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary;
}

.dialog-form {
	@apply space-y-4;
}

.form-group {
	@apply space-y-2;
}

.form-label {
	@apply text-sm font-medium text-gray-700;
}

.form-input {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.form-textarea {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}
</style>
