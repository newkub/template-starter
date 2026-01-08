<script setup lang="ts">
import { useRoute } from "vue-router";
import { useProjects } from "~/composables/useProjects";
import { createError, useHead, navigateTo } from "#imports";
import NavItems from "~/components/NavItems.vue";
import NewProject from "~/pages/dashboard/projects/[id]/new-project.vue";

definePageMeta({
	layout: "dashboard",
});

const route = useRoute();
const { getProjectById } = useProjects();

const projectId = computed(() => Number(route.params.id));
const project = computed(() => {
	const p = getProjectById(projectId.value);
	if (!p)
		throw createError({ statusCode: 404, statusMessage: "Project not found" });
	return p;
});

const menuItems = [
	{ name: "Overview", path: `/dashboard/projects/${projectId.value}` },
	{
		name: "Deployment",
		path: `/dashboard/projects/${projectId.value}/deployment`,
	},
	{ name: "Activity", path: `/dashboard/projects/${projectId.value}/activity` },
	{ name: "Domain", path: `/dashboard/projects/${projectId.value}/domain` },
	{
		name: "Analytics",
		path: `/dashboard/projects/${projectId.value}/analytics`,
	},
	{ name: "Plugins", path: `/dashboard/projects/${projectId.value}/plugins` },
	{ name: "Auth", path: `/dashboard/projects/${projectId.value}/auth` },
	{ name: "Storage", path: `/dashboard/projects/${projectId.value}/storage` },
	{ name: "Database", path: `/dashboard/projects/${projectId.value}/database` },
	{ name: "AI", path: `/dashboard/projects/${projectId.value}/ai` },
	{ name: "Team", path: `/dashboard/projects/${projectId.value}/team` },
	{ name: "Settings", path: `/dashboard/projects/${projectId.value}/settings` },
];

const showNewProject = ref(false);

const openNewProject = () => {
	showNewProject.value = true;
};

const closeNewProject = () => {
	showNewProject.value = false;
};

const navigateToNewProject = () => {
	navigateTo(`/dashboard/projects/${route.params.id}/new-project`);
};

useHead({
	title: `${project.value.name} | Dashboard`,
});
</script>

<template>
  <div class="p-8 bg-background min-h-screen">
    <div class="flex flex-row gap-6">
      <!-- Sidebar -->
      <div class="w-64 shrink-0">
        <header class="flex justify-between items-center mb-8">
          <div>
            <NuxtLink to="/dashboard/projects" class="flex items-center text-text/60 hover:text-brand transition-colors mb-2">
              <div class="i-mdi-arrow-left mr-2" />
              Back to projects
            </NuxtLink>
            <h1 class="text-2xl font-semibold text-text">{{ project.name }}</h1>
          </div>
        </header>
        <NavItems 
          :menu-items="menuItems" 
          direction="vertical"
        />
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <NewProject v-if="showNewProject" @close="closeNewProject" />
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Project Overview -->
            <div class="md:col-span-2 space-y-6">
              <div class="bg-background-block rounded-xl p-6">
                <h2 class="text-lg font-medium mb-4">Project Overview</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-text/60 mb-1">Status</p>
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-medium tracking-wide"
                      :class="{
                        'bg-brand-success/10 text-brand-success': project.status === 'Production',
                        'bg-brand-warning/10 text-brand-warning': project.status === 'Development',
                        'bg-brand/10 text-brand': project.status === 'Staging',
                        'bg-brand-error/10 text-brand-error': project.status === 'Setup required' || project.status === 'Error'
                      }"
                    >
                      {{ project.status }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-text/60 mb-1">Last Deploy</p>
                    <p class="text-sm">{{ project.lastDeploy }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-text/60 mb-1">Repository</p>
                    <a 
                      :href="`https://github.com/${project.repo}`" 
                      target="_blank" 
                      class="text-sm text-brand hover:underline flex items-center"
                    >
                      {{ project.repo }}
                      <div class="i-mdi-open-in-new ml-1 text-xs" />
                    </a>
                  </div>
                  <div>
                    <p class="text-sm text-text/60 mb-1">URL</p>
                    <a 
                      :href="`https://${project.url}`" 
                      target="_blank" 
                      class="text-sm text-brand hover:underline flex items-center"
                    >
                      {{ project.url }}
                      <div class="i-mdi-open-in-new ml-1 text-xs" />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="bg-background-block rounded-xl p-6">
                <h2 class="text-lg font-medium mb-4">Recent Activity</h2>
                <div class="space-y-4">
                  <div v-for="i in 3" :key="i" class="flex items-start">
                    <div class="bg-brand/10 text-brand rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                      <div class="i-mdi-git text-base" />
                    </div>
                    <div>
                      <p class="text-sm">Deployed to production</p>
                      <p class="text-xs text-text/60">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-6">
              <!-- Recent Activity -->
              <div class="bg-background-block rounded-xl p-6">
                <h2 class="text-lg font-medium mb-4">Recent Activity</h2>
                <div class="space-y-4">
                  <div v-for="i in 3" :key="i" class="flex items-start">
                    <div class="bg-brand/10 text-brand rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                      <div class="i-mdi-git text-base" />
                    </div>
                    <div>
                      <p class="text-sm">Deployed to production</p>
                      <p class="text-xs text-text/60">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
