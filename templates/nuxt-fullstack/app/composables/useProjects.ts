import { ref } from "vue";
import type { Project } from "~/types/project";

export const useProjects = () => {
	const projects = ref<Project[]>([
		{
			id: 1,
			name: "AI SDK Computer Use",
			url: "ai-sdk-computer-use.vercel.app",
			repo: "newkub/ai-sdk-computer-use",
			status: "Production",
			lastDeploy: "Just now",
			updatedAt: "Updated 2 minutes ago",
			icon: "N",
		},
		{
			id: 2,
			name: "AI SDK Starter",
			url: "ai-sdk-starter.vercel.app",
			repo: "newkub/ai-sdk-starter",
			status: "Production",
			lastDeploy: "2 minutes ago",
			updatedAt: "Updated 1 day ago",
			icon: "N",
		},
		{
			id: 3,
			name: "AI SDK Template",
			url: "ai-sdk-template.vercel.app",
			repo: "newkub/ai-sdk-template",
			status: "Production",
			lastDeploy: "5 minutes ago",
			updatedAt: "Updated 3 days ago",
			icon: "N",
		},
		{
			id: 4,
			name: "New Project",
			url: "new-project.vercel.app",
			repo: "newkub/new-project",
			status: "Setup required",
			lastDeploy: "Not deployed",
			updatedAt: "Created just now",
			icon: "+",
		},
	]);

	const getProjectById = (id: number) => {
		return projects.value.find((project) => project.id === id);
	};

	const addProject = (project: Omit<Project, "id">) => {
		const newId = Math.max(0, ...projects.value.map((p) => p.id)) + 1;
		const newProject = { ...project, id: newId };
		projects.value.unshift(newProject);
		return newProject;
	};

	const refreshProjects = async () => {
		// TODO: Implement actual API call to refresh projects
		const data = await $fetch<Project[]>("/api/projects");
		projects.value = data;
	};

	return {
		projects,
		getProjectById,
		addProject,
		refreshProjects,
	};
};
