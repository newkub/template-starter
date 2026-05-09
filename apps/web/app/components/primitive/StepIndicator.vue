<script setup lang="ts">
interface Step {
	id: number;
	label: string;
	icon: string;
	completed: boolean;
	current: boolean;
}

defineProps<{
	steps: Step[];
}>();
</script>

<template>
	<div class="relative">
		<div class="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
		
		<div class="space-y-6">
			<div
				v-for="(step, index) in steps"
				:key="step.id"
				class="relative flex items-start gap-4"
			>
				<div
					class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
					:class="{
						'bg-blue-600 text-white': step.current,
						'bg-green-600 text-white': step.completed && !step.current,
						'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400': !step.completed && !step.current
					}"
				>
					<Icon
						v-if="step.completed"
						:name="'mdi:check'"
						class="text-sm"
					/>
					<Icon
						v-else
						:name="step.icon"
						class="text-sm"
					/>
				</div>
				
				<div
					class="flex-1 pt-1 transition-all duration-300"
					:class="{
						'opacity-100': step.current || step.completed,
						'opacity-50': !step.completed && !step.current
					}"
				>
					<p
						class="text-sm font-medium transition-colors duration-300"
						:class="{
							'text-blue-600 dark:text-blue-400': step.current,
							'text-green-600 dark:text-green-400': step.completed && !step.current,
							'text-gray-700 dark:text-gray-300': !step.completed && !step.current
						}"
					>
						{{ step.label }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
