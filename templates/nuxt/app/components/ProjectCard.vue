<script setup lang="ts">
import type { Project } from "~/shared/types/project";

const props = defineProps<{
	project: Project;
	loading?: boolean;
}>();

const { project, loading } = toRefs(props);

const statusColorMap: Partial<Record<Project["status"], string>> = {
	Production: "bg-brand-success/10 text-brand-success",
	Development: "bg-brand-warning/10 text-brand-warning",
	Staging: "bg-brand/10 text-brand",
	"Setup required": "bg-brand-error/10 text-brand-error",
	Error: "bg-brand-error/10 text-brand-error",
	Unknown: "bg-gray-500/10 text-gray-500",
	Pending: "bg-yellow-500/10 text-yellow-500",
	Success: "bg-green-500/10 text-green-500",
	Failed: "bg-red-500/10 text-red-500",
	Canceled: "bg-gray-400/10 text-gray-400",
	Deploying: "bg-blue-500/10 text-blue-500",
	Idle: "bg-purple-500/10 text-purple-500",
	Approved: "bg-brand-success/10 text-brand-success",
	Published: "bg-brand/10 text-brand",
	"Waiting for approval": "bg-yellow-500/10 text-yellow-500",
	Draft: "bg-gray-500/10 text-gray-500",
	Building: "bg-orange-500/10 text-orange-500",
	Queued: "bg-cyan-500/10 text-cyan-500",
	Running: "bg-teal-500/10 text-teal-500",
	"In progress": "bg-blue-500/10 text-blue-500",
	Rejected: "bg-red-500/10 text-red-500",
	Timeout: "bg-gray-600/10 text-gray-600",
	Stopping: "bg-pink-500/10 text-pink-500",
	Stopped: "bg-indigo-500/10 text-indigo-500",
	Terminated: "bg-brown-500/10 text-brown-500",
	Skipped: "bg-gray-300/10 text-gray-300",
	"Not started": "bg-gray-200/10 text-gray-200",
	Unpublished: "bg-gray-400/10 text-gray-400",
	Archived: "bg-gray-600/10 text-gray-600",
	Deleted: "bg-gray-700/10 text-gray-700",
};

const getStatusColor = (status: Project["status"]) => {
	return statusColorMap[status] || "bg-gray-500/10 text-gray-500";
};
</script>

<template>
  <div 
    class="bg-background-block rounded-xl p-4 hover:ring-2 hover:ring-brand/20 transition-all cursor-pointer"
    :class="{ 'animate-pulse': loading }"
    data-testid="project-card"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center space-x-3">
        <div class="bg-brand/10 text-brand rounded-lg w-10 h-10 flex items-center justify-center">
          <span class="font-medium">{{ project.icon }}</span>
        </div>
        <div>
          <h3 class="font-medium text-text mb-1">{{ project.name }}</h3>
          <p class="text-sm text-text/60 mb-3">{{ project.lastDeploy }}</p>
        </div>
      </div>
      <span 
        class="px-2 py-1 rounded-full text-xs font-medium"
        :class="getStatusColor(project.status)"
      >
        {{ project.status }}
      </span>
    </div>

    <div class="mt-4 flex items-center space-x-2 text-sm">
      <div class="flex items-center space-x-1 text-text/60">
        <div class="i-mdi-git mr-1.5" />
        <span>{{ project.repo }}</span>
      </div>
    </div>
    
    <div class="mt-3 flex items-center justify-between text-sm">
      <span 
        class="px-3 py-1 rounded-full text-xs font-medium tracking-wide" 
        :class="getStatusColor(project.status)"
      >
        {{ project.status }}
      </span>
      <span class="text-text/60 text-sm">{{ project.lastDeploy }}</span>
    </div>
    
    <div class="mt-4 pt-3 border-t border-border/50 text-xs text-text/60">
      <div class="flex justify-between">
        <span>{{ project.updatedAt }}</span>
        <div class="flex space-x-2">
          <button class="text-gray-400 hover:text-white">
            <div class="i-mdi-file-document-outline text-base" />
          </button>
          <button class="text-gray-400 hover:text-white">
            <div class="i-mdi-eye-outline text-base" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
