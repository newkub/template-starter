<script setup lang="ts">
import { ref, computed } from "vue";
import type { TemplateConfig } from "~/shared/types/template";
import { useUrlShare } from "~/composables/core/useUrlShare";
import { useClipboard } from "~/composables/core/useClipboard";

interface Props {
	config: TemplateConfig | null;
}

const props = defineProps<Props>();

const { generateShareUrl, copyShareUrl } = useUrlShare();
const { copied, copyToClipboard } = useClipboard();

const shareUrl = computed(() => {
	if (!props.config) return "";
	return generateShareUrl(props.config);
});

const handleCopy = async () => {
	if (shareUrl.value) {
		await copyToClipboard(shareUrl.value);
	}
};

const handleShare = async () => {
	if (shareUrl.value && navigator.share) {
		try {
			await navigator.share({
				title: "Template Configuration",
				text: "Check out this template configuration",
				url: shareUrl.value,
			});
		} catch {
			await handleCopy();
		}
	} else {
		await handleCopy();
	}
};
</script>

<template>
	<div v-if="config" class="space-y-4">
		<h3 class="font-semibold text-gray-900 dark:text-gray-100">Share Configuration</h3>

		<div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
			<div class="flex items-center gap-3">
				<div class="flex-1 min-w-0">
					<code class="block text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800 truncate">{{ shareUrl }}</code>
				</div>
				<div class="flex gap-2">
					<button
						@click="handleCopy"
						class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
						title="Copy URL"
					>
						<Icon :name="copied ? 'mdi:check' : 'mdi:content-copy'" class="text-lg" />
					</button>
					<button
						@click="handleShare"
						class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
						title="Share"
					>
						<Icon name="mdi:share-variant" class="text-lg" />
					</button>
				</div>
			</div>
		</div>

		<div class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
			<Icon name="mdi:information" class="text-base mt-0.5" />
			<p>Share this URL to let others load your template configuration</p>
		</div>
	</div>
</template>
