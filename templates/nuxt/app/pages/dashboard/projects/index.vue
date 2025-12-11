<script setup lang="ts">
import { useProjects } from "~/composables/useProjects";
import type { Project } from "~/types/project";
import { navigateTo } from "#imports";

definePageMeta({
	layout: "dashboard",
});

const { projects, refreshProjects } = useProjects();
const router = useRouter();

const handleNewProject = () => {
	navigateTo("/dashboard/projects/new-project");
};

const navigateToProject = (project: Project) => {
	router.push(`/dashboard/projects/${project.id}`);
};

useHead({
	title: "projectss | Dashboard",
});
</script>

<template>
  <div class="p-8 bg-background min-h-screen">
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold text-text">Dashboard</h1>
      <nav class="flex space-x-4">
        <button 
          class="px-4 py-2 bg-brand-brand text-white rounded-lg hover:opacity-90 transition-opacity"
          @click="handleNewProject"
        >
          New Project
        </button>
        <button 
          class="p-2 rounded-lg bg-background-block hover:opacity-90 transition-opacity"
          aria-label="Menu"
        >
          <div class="i-mdi-menu text-lg" />
        </button>
      </nav>
    </header>

    <main>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProjectCard 
          v-for="project in projects" 
          :key="project.id"
          :project="project"
          @click="navigateToProject(project)"
        />
      </div>
    </main>
  </div>
</template>