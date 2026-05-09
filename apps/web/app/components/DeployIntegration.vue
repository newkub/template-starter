<script setup lang="ts">
import type { DeployConfig, DeployStatus, TemplateConfig } from "#shared/types/template";
import { useDeployIntegration } from "~/composables/core/useDeployIntegration";

const props = defineProps<{
	templateConfig: TemplateConfig;
}>();

const emit = defineEmits<{
	deployed: [status: DeployStatus];
}>();

const { deploy, getAllDeployStatuses, cancelDeploy } = useDeployIntegration();

const showDeployModal = ref(false);
const isDeploying = ref(false);
const deployStatus = ref<DeployStatus | null>(null);

const deployConfig = ref<DeployConfig>({
	provider: "vercel",
	projectName: `${props.templateConfig.ecosystem}-app`,
	environmentVariables: {},
	buildCommand: undefined,
	outputDirectory: undefined,
});

const providers = [
	{ id: "vercel", name: "Vercel", icon: "mdi:cloud" },
	{ id: "netlify", name: "Netlify", icon: "mdi:cloud-outline" },
	{ id: "cloudflare", name: "Cloudflare Pages", icon: "mdi:lightning-bolt" },
	{ id: "github", name: "GitHub Pages", icon: "mdi:github" },
];

const deployHistory = computed(() => Object.values(getAllDeployStatuses()).reverse().slice(0, 5));

const handleDeploy = async () => {
	isDeploying.value = true;
	deployStatus.value = null;

	try {
		const status = await deploy(deployConfig.value, props.templateConfig);
		deployStatus.value = status;
		emit("deployed", status);
	} catch (error) {
		console.error("Deploy failed:", error);
	} finally {
		isDeploying.value = false;
	}
};

const handleCancel = () => {
	if (deployStatus.value) {
		cancelDeploy(deployStatus.value.id);
	}
};

const getStatusColor = (status: DeployStatus["status"]) => {
	switch (status) {
		case "success":
			return "bg-green-500";
		case "failed":
			return "bg-red-500";
		case "building":
			return "bg-yellow-500";
		default:
			return "bg-gray-500";
	}
};

const getStatusText = (status: DeployStatus["status"]) => {
	switch (status) {
		case "success":
			return "Deployed Successfully";
		case "failed":
			return "Deploy Failed";
		case "building":
			return "Building...";
		default:
			return "Pending";
	}
};
</script>

<template>
	<div class="deploy-panel">
		<div class="deploy-header">
			<h3 class="text-lg font-semibold">One-Click Deploy</h3>
			<button
				@click="showDeployModal = true"
				class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				Deploy Now
			</button>
		</div>

		<div v-if="deployHistory.length > 0" class="deploy-history">
			<h4 class="history-title">Recent Deploys</h4>
			<div class="history-list">
				<div
					v-for="status in deployHistory"
					:key="status.id"
					class="history-item"
				>
					<div class="history-info">
						<div class="history-provider">
							<Icon :name="getProviderIcon(status.provider)" />
							<span>{{ status.provider }}</span>
						</div>
						<div class="history-status">
							<span :class="['status-dot', getStatusColor(status.status)]" />
							<span class="status-text">{{ getStatusText(status.status) }}</span>
						</div>
					</div>
					<div class="history-time">
						{{ new Date(status.startedAt).toLocaleString() }}
					</div>
					<a
						v-if="status.url"
						:href="status.url"
						target="_blank"
						rel="noopener noreferrer"
						class="history-link"
					>
						View
					</a>
				</div>
			</div>
		</div>

		<Dialog v-model:open="showDeployModal">
			<DialogContent class="deploy-modal">
				<DialogHeader>
					<DialogTitle>Deploy Template</DialogTitle>
					<DialogDescription>
						Choose a deployment provider and configure your project
					</DialogDescription>
				</DialogHeader>

				<div class="deploy-form">
					<div class="form-group">
						<label class="form-label">Provider</label>
						<div class="provider-grid">
							<button
								v-for="provider in providers"
								:key="provider.id"
								:class="['provider-card', { active: deployConfig.provider === provider.id }]"
								@click="deployConfig.provider = provider.id as DeployConfig['provider']"
							>
								<Icon :name="provider.icon" class="provider-icon" />
								<span class="provider-name">{{ provider.name }}</span>
							</button>
						</div>
					</div>

					<div class="form-group">
						<label class="form-label">Project Name</label>
						<input
							v-model="deployConfig.projectName"
							type="text"
							class="form-input"
							placeholder="my-awesome-app"
						/>
					</div>

					<div class="form-group">
						<label class="form-label">Environment Variables</label>
						<div class="env-vars">
							<div
								v-for="(value, key) in deployConfig.environmentVariables"
								:key="key"
								class="env-var-item"
							>
								<input
									:value="key"
									type="text"
									class="env-input"
									placeholder="KEY"
									readonly
								/>
								<input
									:value="value"
									type="text"
									class="env-input"
									placeholder="value"
									@input="(e) => (deployConfig.environmentVariables![key] = e.target.value)"
								/>
								<button
									@click="delete deployConfig.environmentVariables![key]"
									class="env-delete"
								>
									<Icon name="mdi:delete" />
								</button>
							</div>
							<button
								@click="
									deployConfig.environmentVariables = {
										...deployConfig.environmentVariables,
										'': '',
									}
								"
								class="env-add"
							>
								<Icon name="mdi:plus" />
								Add Variable
							</button>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" @click="showDeployModal = false">
						Cancel
					</Button>
					<Button
						:disabled="isDeploying || !deployConfig.projectName"
						@click="handleDeploy"
					>
						<Icon v-if="isDeploying" name="mdi:loading" class="animate-spin" />
						{{ isDeploying ? "Deploying..." : "Deploy" }}
					</Button>
				</DialogFooter>

				<div v-if="deployStatus" class="deploy-status">
					<div class="status-header">
						<span :class="['status-dot', getStatusColor(deployStatus.status)]" />
						<span class="status-text">{{ getStatusText(deployStatus.status) }}</span>
						<button
							v-if="deployStatus.status === 'building'"
							@click="handleCancel"
							class="cancel-btn"
						>
							Cancel
						</button>
					</div>
					<div v-if="deployStatus.error" class="status-error">
						{{ deployStatus.error }}
					</div>
					<div v-if="deployStatus.url" class="status-url">
						<a :href="deployStatus.url" target="_blank" rel="noopener noreferrer">
							{{ deployStatus.url }}
						</a>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	</div>
</template>

<style scoped>
.deploy-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.deploy-header {
	@apply mb-4 flex items-center justify-between;
}

.deploy-history {
	@apply space-y-3;
}

.history-title {
	@apply text-sm font-semibold text-gray-700;
}

.history-list {
	@apply space-y-2;
}

.history-item {
	@apply flex items-center justify-between rounded-lg bg-gray-50 p-3;
}

.history-info {
	@apply flex items-center gap-4;
}

.history-provider {
	@apply flex items-center gap-2 text-sm font-medium text-gray-700;
}

.history-status {
	@apply flex items-center gap-2;
}

.status-dot {
	@apply h-2 w-2 rounded-full;
}

.status-text {
	@apply text-sm text-gray-600;
}

.history-time {
	@apply text-xs text-gray-500;
}

.history-link {
	@apply text-sm font-medium text-primary hover:underline;
}

.deploy-modal {
	@apply max-w-2xl;
}

.deploy-form {
	@apply space-y-4;
}

.form-group {
	@apply space-y-2;
}

.form-label {
	@apply text-sm font-medium text-gray-700;
}

.provider-grid {
	@apply grid grid-cols-2 gap-3;
}

.provider-card {
	@apply flex flex-col items-center gap-2 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-primary/50;
}

.provider-card.active {
	@apply border-primary bg-primary/5;
}

.provider-icon {
	@apply h-8 w-8 text-gray-600;
}

.provider-card.active .provider-icon {
	@apply text-primary;
}

.provider-name {
	@apply text-sm font-medium;
}

.form-input {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.env-vars {
	@apply space-y-2;
}

.env-var-item {
	@apply flex gap-2;
}

.env-input {
	@apply flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.env-delete {
	@apply rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50;
}

.env-add {
	@apply flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary;
}

.deploy-status {
	@apply mt-4 rounded-lg bg-gray-50 p-4;
}

.status-header {
	@apply mb-2 flex items-center gap-2;
}

.cancel-btn {
	@apply ml-auto rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50;
}

.status-error {
	@apply mb-2 rounded-lg bg-red-50 p-3 text-sm text-red-700;
}

.status-url {
	@apply text-sm;
}

.status-url a {
	@apply text-primary hover:underline;
}
</style>
