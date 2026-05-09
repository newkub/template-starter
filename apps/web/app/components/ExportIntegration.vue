<script setup lang="ts">
import type { TemplateConfig, ExportConfig } from "#shared/types/template";
import { useExportTemplate } from "~/composables/core/useExportTemplate";

const props = defineProps<{
	templateConfig: TemplateConfig;
}>();

const emit = defineEmits<{
	exported: [result: { id: string; format: string; url?: string; path?: string }];
}>();

const {
	exportTemplate,
	getExportResults,
	downloadAsZip,
	downloadAsTarball,
	clearExportHistory,
} = useExportTemplate();

const showExportPanel = ref(false);
const isExporting = ref(false);
const exportResult = ref<{ id: string; format: string; url?: string; path?: string } | null>(null);

const exportConfig = ref<ExportConfig>({
	format: "github",
	repoName: `${props.templateConfig.ecosystem}-app`,
	repoDescription: `A ${props.templateConfig.ecosystem} template`,
	isPrivate: false,
	includeGit: true,
});

const exportHistory = computed(() => getExportResults().reverse().slice(0, 5));

const handleExport = async () => {
	isExporting.value = true;
	exportResult.value = null;

	try {
		const result = await exportTemplate(props.templateConfig, exportConfig.value);
		exportResult.value = {
			id: result.id,
			format: result.format,
			url: result.url,
			path: result.path,
		};
		emit("exported", exportResult.value);
	} catch (error) {
		console.error("Export failed:", error);
	} finally {
		isExporting.value = false;
	}
};

const handleDownloadZip = () => {
	downloadAsZip(props.templateConfig);
};

const handleDownloadTarball = () => {
	downloadAsTarball(props.templateConfig);
};

const handleClearHistory = () => {
	clearExportHistory();
};

const getFormatIcon = (format: ExportConfig["format"]) => {
	switch (format) {
		case "github":
			return "mdi:github";
		case "gitlab":
			return "mdi:gitlab";
		case "folder":
			return "mdi:folder";
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "success":
			return "text-green-600";
		case "failed":
			return "text-red-600";
		default:
			return "text-gray-600";
	}
};
</script>

<template>
	<div class="export-panel">
		<div class="export-header">
			<h3 class="text-lg font-semibold">Export Template</h3>
			<button
				@click="showExportPanel = !showExportPanel"
				class="toggle-btn"
			>
				{{ showExportPanel ? "Hide" : "Show" }} Panel
			</button>
		</div>

		<div v-if="showExportPanel" class="export-content">
			<div class="export-section">
				<h4 class="section-title">Export Options</h4>

				<div class="form-group">
					<label class="form-label">Export Format</label>
					<div class="format-grid">
						<button
							:class="['format-card', { active: exportConfig.format === 'github' }]"
							@click="exportConfig.format = 'github'"
						>
							<Icon name="mdi:github" class="format-icon" />
							<div class="format-info">
								<span class="format-name">GitHub</span>
								<span class="format-desc">Create GitHub repository</span>
							</div>
						</button>

						<button
							:class="['format-card', { active: exportConfig.format === 'gitlab' }]"
							@click="exportConfig.format = 'gitlab'"
						>
							<Icon name="mdi:gitlab" class="format-icon" />
							<div class="format-info">
								<span class="format-name">GitLab</span>
								<span class="format-desc">Create GitLab repository</span>
							</div>
						</button>

						<button
							:class="['format-card', { active: exportConfig.format === 'folder' }]"
							@click="exportConfig.format = 'folder'"
						>
							<Icon name="mdi:folder" class="format-icon" />
							<div class="format-info">
								<span class="format-name">Folder</span>
								<span class="format-desc">Download as folder</span>
							</div>
						</button>
					</div>
				</div>

				<div v-if="exportConfig.format !== 'folder'" class="form-group">
					<label class="form-label">Repository Name</label>
					<input
						v-model="exportConfig.repoName"
						type="text"
						class="form-input"
						placeholder="my-awesome-app"
					/>
				</div>

				<div v-if="exportConfig.format !== 'folder'" class="form-group">
					<label class="form-label">Repository Description</label>
					<textarea
						v-model="exportConfig.repoDescription"
						class="form-textarea"
						placeholder="A brief description of your project"
						rows="2"
					/>
				</div>

				<div v-if="exportConfig.format !== 'folder'" class="form-group">
					<label class="form-checkbox-label">
						<input
							v-model="exportConfig.isPrivate"
							type="checkbox"
							class="form-checkbox"
						/>
						<span class="checkbox-text">Private Repository</span>
					</label>
				</div>

				<div class="form-group">
					<label class="form-checkbox-label">
						<input
							v-model="exportConfig.includeGit"
							type="checkbox"
							class="form-checkbox"
						/>
						<span class="checkbox-text">Include .git folder</span>
					</label>
				</div>

				<button
					:disabled="isExporting || (exportConfig.format !== 'folder' && !exportConfig.repoName)"
					@click="handleExport"
					class="export-btn"
				>
					<Icon v-if="isExporting" name="mdi:loading" class="animate-spin" />
					{{ isExporting ? "Exporting..." : "Export" }}
				</button>

				<div v-if="exportResult" class="export-result">
					<div class="result-header">
						<Icon :name="getFormatIcon(exportResult.format as ExportConfig['format'])" class="result-icon" />
						<span class="result-text">Export Successful!</span>
					</div>
					<div v-if="exportResult.url" class="result-url">
						<a :href="exportResult.url" target="_blank" rel="noopener noreferrer">
							{{ exportResult.url }}
						</a>
					</div>
					<div v-if="exportResult.path" class="result-path">
						{{ exportResult.path }}
					</div>
				</div>
			</div>

			<div class="download-section">
				<h4 class="section-title">Quick Download</h4>
				<div class="download-buttons">
					<button
						@click="handleDownloadZip"
						class="download-btn zip"
					>
						<Icon name="mdi:file-zip" />
						Download as ZIP
					</button>
					<button
						@click="handleDownloadTarball"
						class="download-btn tarball"
					>
						<Icon name="mdi:file-archive" />
						Download as Tarball
					</button>
				</div>
			</div>

			<div v-if="exportHistory.length > 0" class="history-section">
				<div class="history-header">
					<h4 class="section-title">Export History</h4>
					<button
						@click="handleClearHistory"
						class="clear-history-btn"
					>
						Clear History
					</button>
				</div>
				<div class="history-list">
					<div
						v-for="item in exportHistory"
						:key="item.id"
						class="history-item"
					>
						<div class="history-info">
							<Icon :name="getFormatIcon(item.format)" class="history-icon" />
							<span class="history-format">{{ item.format }}</span>
							<span class="history-time">
								{{ new Date(item.exportedAt).toLocaleString() }}
							</span>
						</div>
						<div class="history-status">
							<span :class="['status-text', getStatusColor(item.status)]">
								{{ item.status }}
							</span>
							<a
								v-if="item.url"
								:href="item.url"
								target="_blank"
								rel="noopener noreferrer"
								class="history-link"
							>
								View
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.export-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.export-header {
	@apply mb-4 flex items-center justify-between;
}

.toggle-btn {
	@apply rounded-lg bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-primary/90;
}

.export-content {
	@apply space-y-6;
}

.export-section,
.download-section,
.history-section {
	@apply space-y-3;
}

.section-title {
	@apply text-sm font-semibold text-gray-700;
}

.form-group {
	@apply space-y-2;
}

.form-label {
	@apply text-sm font-medium text-gray-700;
}

.format-grid {
	@apply grid grid-cols-3 gap-3;
}

.format-card {
	@apply flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-primary/50;
}

.format-card.active {
	@apply border-primary bg-primary/5;
}

.format-icon {
	@apply h-8 w-8 text-gray-600;
}

.format-card.active .format-icon {
	@apply text-primary;
}

.format-info {
	@apply flex flex-col items-center text-center;
}

.format-name {
	@apply font-medium text-gray-900;
}

.format-desc {
	@apply text-xs text-gray-600;
}

.form-input {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.form-textarea {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.form-checkbox-label {
	@apply flex items-center gap-2;
}

.form-checkbox {
	@apply h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary;
}

.checkbox-text {
	@apply text-sm text-gray-700;
}

.export-btn {
	@apply flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-white font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed;
}

.export-result {
	@apply rounded-lg bg-green-50 p-4;
}

.result-header {
	@apply mb-2 flex items-center gap-2;
}

.result-icon {
	@apply h-5 w-5 text-green-600;
}

.result-text {
	@apply font-semibold text-green-800;
}

.result-url,
.result-path {
	@apply text-sm text-green-700;
}

.result-url a {
	@apply text-green-600 hover:underline;
}

.download-buttons {
	@apply flex gap-3;
}

.download-btn {
	@apply flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary;
}

.download-btn.zip {
	@apply bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800;
}

.download-btn.tarball {
	@apply bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-300 hover:text-orange-800;
}

.history-header {
	@apply flex items-center justify-between;
}

.clear-history-btn {
	@apply rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50;
}

.history-list {
	@apply space-y-2;
}

.history-item {
	@apply flex items-center justify-between rounded-lg border border-gray-200 p-3;
}

.history-info {
	@apply flex items-center gap-2;
}

.history-icon {
	@apply h-5 w-5 text-gray-600;
}

.history-format {
	@apply font-medium text-gray-900;
}

.history-time {
	@apply text-xs text-gray-600;
}

.history-status {
	@apply flex items-center gap-2;
}

.status-text {
	@apply text-sm font-medium;
}

.history-link {
	@apply text-sm font-medium text-primary hover:underline;
}
</style>
