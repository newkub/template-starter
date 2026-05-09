<script setup lang="ts">
import type { TemplateConfig, TestResult, ValidationResult } from "#shared/types/template";
import { useTemplateTesting } from "~/composables/core/useTemplateTesting";

const props = defineProps<{
	templateConfig: TemplateConfig;
}>();

const { validateTemplate, runTests, getLatestTestResult } = useTemplateTesting();

const showTestingPanel = ref(false);
const isRunningTests = ref(false);
const testResult = ref<TestResult | null>(null);
const validationResult = ref<ValidationResult | null>(null);

const latestTestResult = computed(() =>
	getLatestTestResult(props.templateConfig.ecosystem),
);

const handleValidate = () => {
	validationResult.value = validateTemplate(props.templateConfig);
};

const handleRunTests = async () => {
	isRunningTests.value = true;
	testResult.value = null;

	try {
		const result = await runTests(props.templateConfig);
		testResult.value = result;
	} catch (error) {
		console.error("Tests failed:", error);
	} finally {
		isRunningTests.value = false;
	}
};

const getStatusIcon = (status: TestResult["tests"][number]["status"]) => {
	switch (status) {
		case "passed":
			return "mdi:check-circle";
		case "failed":
			return "mdi:close-circle";
		case "warning":
			return "mdi:alert-circle";
		case "skipped":
			return "mdi:minus-circle";
		default:
			return "mdi:help-circle";
	}
};

const getStatusColor = (status: TestResult["tests"][number]["status"]) => {
	switch (status) {
		case "passed":
			return "text-green-600";
		case "failed":
			return "text-red-600";
		case "warning":
			return "text-yellow-600";
		case "skipped":
			return "text-gray-600";
	}
};

const getOverallStatusColor = (status: TestResult["status"]) => {
	switch (status) {
		case "passed":
			return "bg-green-100 text-green-800";
		case "failed":
			return "bg-red-100 text-red-800";
		case "warning":
			return "bg-yellow-100 text-yellow-800";
	}
};

const formatDuration = (ms: number) => {
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
};
</script>

<template>
	<div class="testing-panel">
		<div class="testing-header">
			<h3 class="text-lg font-semibold">Template Testing & Validation</h3>
			<button
				@click="showTestingPanel = !showTestingPanel"
				class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				{{ showTestingPanel ? "Hide" : "Show" }} Panel
			</button>
		</div>

		<div v-if="showTestingPanel" class="testing-content">
			<div class="validation-section">
				<h4 class="section-title">Validation</h4>
				<button
					@click="handleValidate"
					class="validate-btn"
				>
					Validate Config
				</button>

				<div v-if="validationResult" class="validation-result">
					<div
						:class="[
							'validation-badge',
							validationResult.isValid ? 'valid' : 'invalid',
						]"
					>
						{{ validationResult.isValid ? "Valid" : "Invalid" }}
					</div>

					<div v-if="validationResult.errors.length > 0" class="validation-errors">
						<h5 class="error-title">Errors</h5>
						<ul class="error-list">
							<li v-for="error in validationResult.errors" :key="error">
								{{ error }}
							</li>
						</ul>
					</div>

					<div v-if="validationResult.warnings.length > 0" class="validation-warnings">
						<h5 class="warning-title">Warnings</h5>
						<ul class="warning-list">
							<li v-for="warning in validationResult.warnings" :key="warning">
								{{ warning }}
							</li>
						</ul>
					</div>

					<div v-if="validationResult.suggestions.length > 0" class="validation-suggestions">
						<h5 class="suggestion-title">Suggestions</h5>
						<ul class="suggestion-list">
							<li v-for="suggestion in validationResult.suggestions" :key="suggestion">
								{{ suggestion }}
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="testing-section">
				<h4 class="section-title">Tests</h4>
				<button
					:disabled="isRunningTests"
					@click="handleRunTests"
					class="test-btn"
				>
					<Icon v-if="isRunningTests" name="mdi:loading" class="animate-spin" />
					{{ isRunningTests ? "Running Tests..." : "Run Tests" }}
				</button>

				<div v-if="testResult" class="test-result">
					<div class="test-summary">
						<span :class="['test-badge', getOverallStatusColor(testResult.status)]">
							{{ testResult.status.toUpperCase() }}
						</span>
						<span class="test-time">
							{{ new Date(testResult.startedAt).toLocaleString() }}
						</span>
						<span class="test-duration">
							{{ formatDuration(new Date(testResult.completedAt).getTime() - new Date(testResult.startedAt).getTime()) }}
						</span>
					</div>

					<div class="test-list">
						<div
							v-for="test in testResult.tests"
							:key="test.name"
							class="test-item"
						>
							<div class="test-item-header">
								<Icon
									:name="getStatusIcon(test.status)"
									:class="['test-icon', getStatusColor(test.status)]"
								/>
								<span class="test-name">{{ test.name }}</span>
								<span class="test-duration">{{ formatDuration(test.duration) }}</span>
							</div>
							<div v-if="test.message" class="test-message">
								{{ test.message }}
							</div>
						</div>
					</div>
				</div>

				<div v-else-if="latestTestResult" class="latest-test">
					<h5 class="latest-title">Latest Test Result</h5>
					<div class="test-summary">
						<span :class="['test-badge', getOverallStatusColor(latestTestResult.status)]">
							{{ latestTestResult.status.toUpperCase() }}
						</span>
						<span class="test-time">
							{{ new Date(latestTestResult.startedAt).toLocaleString() }}
						</span>
					</div>
					<div class="test-list">
						<div
							v-for="test in latestTestResult.tests"
							:key="test.name"
							class="test-item"
						>
							<div class="test-item-header">
								<Icon
									:name="getStatusIcon(test.status)"
									:class="['test-icon', getStatusColor(test.status)]"
								/>
								<span class="test-name">{{ test.name }}</span>
								<span class="test-duration">{{ formatDuration(test.duration) }}</span>
							</div>
							<div v-if="test.message" class="test-message">
								{{ test.message }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.testing-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.testing-header {
	@apply mb-4 flex items-center justify-between;
}

.testing-content {
	@apply space-y-6;
}

.validation-section,
.testing-section {
	@apply space-y-3;
}

.section-title {
	@apply text-sm font-semibold text-gray-700;
}

.validate-btn,
.test-btn {
	@apply flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-white font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed;
}

.validation-result {
	@apply rounded-lg bg-gray-50 p-4;
}

.validation-badge {
	@apply mb-3 inline-block rounded-full px-3 py-1 text-sm font-semibold;
}

.validation-badge.valid {
	@apply bg-green-100 text-green-800;
}

.validation-badge.invalid {
	@apply bg-red-100 text-red-800;
}

.validation-errors,
.validation-warnings,
.validation-suggestions {
	@apply mb-3;
}

.error-title,
.warning-title,
.suggestion-title {
	@apply mb-2 text-sm font-semibold;
}

.error-title {
	@apply text-red-700;
}

.warning-title {
	@apply text-yellow-700;
}

.suggestion-title {
	@apply text-blue-700;
}

.error-list,
.warning-list,
.suggestion-list {
	@apply list-inside list-disc space-y-1 text-sm;
}

.error-list {
	@apply text-red-600;
}

.warning-list {
	@apply text-yellow-600;
}

.suggestion-list {
	@apply text-blue-600;
}

.test-result,
.latest-test {
	@apply rounded-lg bg-gray-50 p-4;
}

.latest-title {
	@apply mb-3 text-sm font-semibold text-gray-700;
}

.test-summary {
	@apply mb-4 flex items-center gap-3;
}

.test-badge {
	@apply rounded-full px-3 py-1 text-sm font-semibold;
}

.test-time,
.test-duration {
	@apply text-sm text-gray-600;
}

.test-list {
	@apply space-y-2;
}

.test-item {
	@apply rounded-lg border border-gray-200 bg-white p-3;
}

.test-item-header {
	@apply mb-2 flex items-center gap-2;
}

.test-icon {
	@apply h-5 w-5;
}

.test-name {
	@apply flex-1 font-medium text-gray-900;
}

.test-message {
	@apply text-sm text-gray-600;
}
</style>
