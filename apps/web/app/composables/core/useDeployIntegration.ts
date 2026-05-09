import type { DeployConfig, DeployStatus, TemplateConfig } from "#shared/types/template";

export const useDeployIntegration = () => {
	const STORAGE_KEY = "deploy-status";

	const getDeployStatus = (templateId: string): DeployStatus | null => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const allStatuses = JSON.parse(data) as Record<string, DeployStatus>;
				return allStatuses[templateId] || null;
			}
		}
		return null;
	};

	const getAllDeployStatuses = (): Record<string, DeployStatus> => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			return data ? JSON.parse(data) : {};
		}
		return {};
	};

	const deployToVercel = async (
		config: DeployConfig,
		templateConfig: TemplateConfig,
	): Promise<DeployStatus> => {
		const deployId = `deploy-${Date.now()}`;
		const status: DeployStatus = {
			id: deployId,
			templateId: templateConfig.ecosystem,
			provider: "vercel",
			status: "pending",
			startedAt: new Date().toISOString(),
		};

		saveDeployStatus(deployId, status);

		try {
			status.status = "building";
			saveDeployStatus(deployId, status);

			const deployUrl = await mockVercelDeploy(config, templateConfig);

			status.status = "success";
			status.url = deployUrl;
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		} catch (error) {
			status.status = "failed";
			status.error = error instanceof Error ? error.message : "Deploy failed";
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		}
	};

	const deployToNetlify = async (
		config: DeployConfig,
		templateConfig: TemplateConfig,
	): Promise<DeployStatus> => {
		const deployId = `deploy-${Date.now()}`;
		const status: DeployStatus = {
			id: deployId,
			templateId: templateConfig.ecosystem,
			provider: "netlify",
			status: "pending",
			startedAt: new Date().toISOString(),
		};

		saveDeployStatus(deployId, status);

		try {
			status.status = "building";
			saveDeployStatus(deployId, status);

			const deployUrl = await mockNetlifyDeploy(config, templateConfig);

			status.status = "success";
			status.url = deployUrl;
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		} catch (error) {
			status.status = "failed";
			status.error = error instanceof Error ? error.message : "Deploy failed";
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		}
	};

	const deployToCloudflare = async (
		config: DeployConfig,
		templateConfig: TemplateConfig,
	): Promise<DeployStatus> => {
		const deployId = `deploy-${Date.now()}`;
		const status: DeployStatus = {
			id: deployId,
			templateId: templateConfig.ecosystem,
			provider: "cloudflare",
			status: "pending",
			startedAt: new Date().toISOString(),
		};

		saveDeployStatus(deployId, status);

		try {
			status.status = "building";
			saveDeployStatus(deployId, status);

			const deployUrl = await mockCloudflareDeploy(config, templateConfig);

			status.status = "success";
			status.url = deployUrl;
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		} catch (error) {
			status.status = "failed";
			status.error = error instanceof Error ? error.message : "Deploy failed";
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		}
	};

	const deployToGitHub = async (
		config: DeployConfig,
		templateConfig: TemplateConfig,
	): Promise<DeployStatus> => {
		const deployId = `deploy-${Date.now()}`;
		const status: DeployStatus = {
			id: deployId,
			templateId: templateConfig.ecosystem,
			provider: "github",
			status: "pending",
			startedAt: new Date().toISOString(),
		};

		saveDeployStatus(deployId, status);

		try {
			status.status = "building";
			saveDeployStatus(deployId, status);

			const deployUrl = await mockGitHubDeploy(config, templateConfig);

			status.status = "success";
			status.url = deployUrl;
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		} catch (error) {
			status.status = "failed";
			status.error = error instanceof Error ? error.message : "Deploy failed";
			status.completedAt = new Date().toISOString();
			saveDeployStatus(deployId, status);

			return status;
		}
	};

	const deploy = async (
		config: DeployConfig,
		templateConfig: TemplateConfig,
	): Promise<DeployStatus> => {
		switch (config.provider) {
			case "vercel":
				return deployToVercel(config, templateConfig);
			case "netlify":
				return deployToNetlify(config, templateConfig);
			case "cloudflare":
				return deployToCloudflare(config, templateConfig);
			case "github":
				return deployToGitHub(config, templateConfig);
			default:
				throw new Error(`Unsupported provider: ${config.provider}`);
		}
	};

	const cancelDeploy = (deployId: string): boolean => {
		const allStatuses = getAllDeployStatuses();
		const status = allStatuses[deployId];

		if (!status || status.status !== "building") return false;

		status.status = "failed";
		status.error = "Deploy cancelled";
		status.completedAt = new Date().toISOString();

		saveDeployStatus(deployId, status);
		return true;
	};

	const clearDeployHistory = (): void => {
		if (import.meta.client) {
			localStorage.removeItem(STORAGE_KEY);
		}
	};

	function saveDeployStatus(deployId: string, status: DeployStatus): void {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY);
			const allStatuses = data ? JSON.parse(data) : {};
			allStatuses[deployId] = status;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(allStatuses));
		}
	}

	return {
		getDeployStatus,
		getAllDeployStatuses,
		deploy,
		deployToVercel,
		deployToNetlify,
		deployToCloudflare,
		deployToGitHub,
		cancelDeploy,
		clearDeployHistory,
	};
};

async function mockVercelDeploy(
	_config: DeployConfig,
	templateConfig: TemplateConfig,
): Promise<string> {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return `https://${templateConfig.ecosystem}-${Date.now()}.vercel.app`;
}

async function mockNetlifyDeploy(
	_config: DeployConfig,
	templateConfig: TemplateConfig,
): Promise<string> {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return `https://${templateConfig.ecosystem}-${Date.now()}.netlify.app`;
}

async function mockCloudflareDeploy(
	_config: DeployConfig,
	templateConfig: TemplateConfig,
): Promise<string> {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return `https://${templateConfig.ecosystem}-${Date.now()}.pages.dev`;
}

async function mockGitHubDeploy(
	_config: DeployConfig,
	templateConfig: TemplateConfig,
): Promise<string> {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	return `https://github.com/${templateConfig.ecosystem}-${Date.now()}`;
}
