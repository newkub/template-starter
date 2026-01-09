<script setup lang="ts">
import { ref, computed } from "vue";
import type { TemplateConfig, TemplateComparison as TemplateComparisonType } from "~/shared/types/template";

interface Props {
	configs: TemplateConfig[];
	onSelect: (config: TemplateConfig) => void;
}

const props = defineProps<Props>();

const comparisons = ref<TemplateComparisonType[]>([]);

const generateComparisons = () => {
	comparisons.value = props.configs.map((config) => {
		const score = calculateScore(config);
		const { pros, cons } = analyzeConfig(config);

		return {
			id: crypto.randomUUID(),
			name: `${config.ecosystem} Template`,
			config,
			score,
			pros,
			cons,
		};
	});
};

const calculateScore = (config: TemplateConfig): number => {
	let score = 0;

	score += config.libraries.length * 10;

	const hasUi = config.libraries.some((lib) => ["shadcn", "nuxt-ui", "material", "compose"].includes(lib));
	const hasState = config.libraries.some((lib) => ["zustand", "pinia", "riverpod", "bloc"].includes(lib));
	const hasApi = config.libraries.some((lib) => ["hono", "trpc", "dio", "ktor"].includes(lib));
	const hasAuth = config.libraries.some((lib) => ["lucia", "next-auth", "firebase-auth", "kauth"].includes(lib));
	const hasDb = config.libraries.some((lib) => ["drizzle", "prisma", "exposed", "sqflite"].includes(lib));

	if (hasUi) score += 20;
	if (hasState) score += 15;
	if (hasApi) score += 15;
	if (hasAuth) score += 15;
	if (hasDb) score += 15;

	return Math.min(score, 100);
};

const analyzeConfig = (config: TemplateConfig) => {
	const pros: string[] = [];
	const cons: string[] = [];

	if (config.libraries.length >= 5) {
		pros.push("Comprehensive feature set");
	} else {
		cons.push("Limited feature set");
	}

	const hasUi = config.libraries.some((lib) => ["shadcn", "nuxt-ui", "material", "compose"].includes(lib));
	if (hasUi) {
		pros.push("Modern UI components");
	}

	const hasState = config.libraries.some((lib) => ["zustand", "pinia", "riverpod", "bloc"].includes(lib));
	if (hasState) {
		pros.push("State management included");
	} else {
		cons.push("No state management");
	}

	const hasAuth = config.libraries.some((lib) => ["lucia", "next-auth", "firebase-auth", "kauth"].includes(lib));
	if (hasAuth) {
		pros.push("Authentication ready");
	} else {
		cons.push("No authentication");
	}

	const hasDb = config.libraries.some((lib) => ["drizzle", "prisma", "exposed", "sqflite"].includes(lib));
	if (hasDb) {
		pros.push("Database integration");
	} else {
		cons.push("No database");
	}

	if (config.libraries.length > 8) {
		cons.push("May be over-engineered for simple projects");
	}

	return { pros, cons };
};

const sortedComparisons = computed(() => {
	return [...comparisons.value].sort((a, b) => b.score - a.score);
});

const getScoreColor = (score: number) => {
	if (score >= 80) return "from-green-500 to-emerald-500";
	if (score >= 60) return "from-yellow-500 to-orange-500";
	return "from-red-500 to-rose-500";
};

generateComparisons();
</script>

<template>
	<div class="space-y-4">
		<h3 class="font-semibold text-gray-900 dark:text-gray-100">Template Comparison</h3>

		<div v-if="comparisons.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
			<Icon name="mdi:compare" class="text-4xl mb-2" />
			<p class="text-sm">Add templates to compare</p>
		</div>

		<div v-else class="space-y-4">
			<div
				v-for="comparison in sortedComparisons"
				:key="comparison.id"
				class="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
			>
				<div class="flex items-start justify-between mb-3">
					<div>
						<h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ comparison.name }}</h4>
						<p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ comparison.config.ecosystem }} • {{ comparison.config.libraries.length }} libraries</p>
					</div>
					<div class="flex items-center gap-2">
						<div :class="`px-3 py-1.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r ${getScoreColor(comparison.score)}`">
							{{ comparison.score }}%
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
					<div>
						<h5 class="text-xs font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
							<Icon name="mdi:check-circle" class="text-base" />
							Pros
						</h5>
						<ul class="space-y-1">
							<li
								v-for="(pro, index) in comparison.pros"
								:key="index"
								class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
							>
								<Icon name="mdi:chevron-right" class="text-xs mt-0.5" />
								{{ pro }}
							</li>
						</ul>
					</div>
					<div>
						<h5 class="text-xs font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-1">
							<Icon name="mdi:alert-circle" class="text-base" />
							Cons
						</h5>
						<ul class="space-y-1">
							<li
								v-for="(con, index) in comparison.cons"
								:key="index"
								class="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
							>
								<Icon name="mdi:chevron-right" class="text-xs mt-0.5" />
								{{ con }}
							</li>
						</ul>
					</div>
				</div>

				<button
					@click="onSelect(comparison.config)"
					class="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
				>
					<Icon name="mdi:download" class="text-base" />
					Select This Template
				</button>
			</div>
		</div>
	</div>
</template>
