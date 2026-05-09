<script setup lang="ts">
import type { Team, TeamMember, SharedTemplate } from "#shared/types/template";
import { useCollaborativeSharing } from "~/composables/core/useCollaborativeSharing";

const emit = defineEmits<{
	share: [sharedTemplate: SharedTemplate];
}>();

const {
	getTeams,
	createTeam,
	addTeamMember,
	updateTeamMemberRole,
	removeTeamMember,
	deleteTeam,
	getSharedTemplatesByTeam,
	shareTemplate,
	updateSharedPermission,
	unshareTemplate,
	getUserTeams,
} = useCollaborativeSharing();

const showSharingPanel = ref(false);
const activeTab = ref<"teams" | "shared">("teams");

const teams = computed(() => getUserTeams("current-user"));

const selectedTeam = ref<Team | null>(null);
const showCreateTeamDialog = ref(false);
const showAddMemberDialog = ref(false);

const newTeamName = ref("");
const newMemberName = ref("");
const newMemberEmail = ref("");
const newMemberRole = ref<TeamMember["role"]>("viewer");

const sharedTemplates = computed(() => {
	if (!selectedTeam.value) return [];
	return getSharedTemplatesByTeam(selectedTeam.value.id);
});

const handleCreateTeam = () => {
	if (!newTeamName.value.trim()) return;

	createTeam(newTeamName.value, "current-user", "Current User", "user@example.com");
	newTeamName.value = "";
	showCreateTeamDialog.value = false;
};

const handleAddMember = () => {
	if (!selectedTeam.value || !newMemberName.value.trim() || !newMemberEmail.value.trim()) return;

	addTeamMember(
		selectedTeam.value.id,
		`member-${Date.now()}`,
		newMemberName.value,
		newMemberEmail.value,
		newMemberRole.value,
	);

	newMemberName.value = "";
	newMemberEmail.value = "";
	newMemberRole.value = "viewer";
	showAddMemberDialog.value = false;
};

const handleUpdateRole = (memberId: string, newRole: TeamMember["role"]) => {
	if (!selectedTeam.value) return;
	updateTeamMemberRole(selectedTeam.value.id, memberId, newRole);
};

const handleRemoveMember = (memberId: string) => {
	if (!selectedTeam.value) return;
	removeTeamMember(selectedTeam.value.id, memberId);
};

const handleDeleteTeam = () => {
	if (!selectedTeam.value) return;
	deleteTeam(selectedTeam.value.id);
	selectedTeam.value = null;
};

const handleShareTemplate = (templateId: string) => {
	if (!selectedTeam.value) return;

	const shared = shareTemplate(templateId, selectedTeam.value.id, "current-user", "read");
	if (shared) {
		emit("share", shared);
	}
};

const handleUpdatePermission = (sharedId: string, newPermission: SharedTemplate["permission"]) => {
	updateSharedPermission(sharedId, newPermission);
};

const handleUnshare = (sharedId: string) => {
	unshareTemplate(sharedId);
};

const getRoleColor = (role: TeamMember["role"]) => {
	switch (role) {
		case "owner":
			return "bg-purple-100 text-purple-800";
		case "admin":
			return "bg-blue-100 text-blue-800";
		case "editor":
			return "bg-green-100 text-green-800";
		case "viewer":
			return "bg-gray-100 text-gray-800";
	}
};

const getPermissionColor = (permission: SharedTemplate["permission"]) => {
	switch (permission) {
		case "admin":
			return "bg-purple-100 text-purple-800";
		case "write":
			return "bg-green-100 text-green-800";
		case "read":
			return "bg-gray-100 text-gray-800";
	}
};
</script>

<template>
	<div class="sharing-panel">
		<div class="sharing-header">
			<h3 class="text-lg font-semibold">Collaborative Sharing</h3>
			<button
				@click="showSharingPanel = !showSharingPanel"
				class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
			>
				{{ showSharingPanel ? "Hide" : "Show" }} Panel
			</button>
		</div>

		<div v-if="showSharingPanel" class="sharing-content">
			<div class="tabs">
				<button
					:class="['tab', { active: activeTab === 'teams' }]"
					@click="activeTab = 'teams'"
				>
					Teams
				</button>
				<button
					:class="['tab', { active: activeTab === 'shared' }]"
					@click="activeTab = 'shared'"
				>
					Shared Templates
				</button>
			</div>

			<div v-if="activeTab === 'teams'" class="teams-section">
				<div class="teams-header">
					<h4 class="section-title">Your Teams</h4>
					<button
						@click="showCreateTeamDialog = true"
						class="create-team-btn"
					>
						<Icon name="mdi:plus" />
						Create Team
					</button>
				</div>

				<div v-if="teams.length > 0" class="teams-list">
					<div
						v-for="team in teams"
						:key="team.id"
						:class="['team-card', { active: selectedTeam?.id === team.id }]"
						@click="selectedTeam = team"
					>
						<div class="team-info">
							<h5 class="team-name">{{ team.name }}</h5>
							<span class="team-members">{{ team.members.length }} members</span>
						</div>
						<div class="team-actions">
							<button
								v-if="selectedTeam?.id === team.id"
								@click.stop="handleDeleteTeam"
								class="delete-btn"
							>
								<Icon name="mdi:delete" />
							</button>
						</div>
					</div>
				</div>

				<div v-else class="no-teams">
					<p>No teams yet. Create one to start collaborating!</p>
				</div>

				<div v-if="selectedTeam" class="team-details">
					<div class="team-details-header">
						<h5 class="team-details-title">{{ selectedTeam.name }}</h5>
						<button
							@click="showAddMemberDialog = true"
							class="add-member-btn"
						>
							<Icon name="mdi:account-plus" />
							Add Member
						</button>
					</div>

					<div class="members-list">
						<div
							v-for="member in selectedTeam.members"
							:key="member.id"
							class="member-item"
						>
							<div class="member-info">
								<div class="member-avatar">
									{{ member.name.charAt(0).toUpperCase() }}
								</div>
								<div class="member-details">
									<span class="member-name">{{ member.name }}</span>
									<span class="member-email">{{ member.email }}</span>
								</div>
							</div>
							<div class="member-role">
								<select
									:value="member.role"
									:disabled="member.role === 'owner'"
									@change="handleUpdateRole(member.id, $event.target.value as TeamMember['role'])"
									class="role-select"
								>
									<option value="owner">Owner</option>
									<option value="admin">Admin</option>
									<option value="editor">Editor</option>
									<option value="viewer">Viewer</option>
								</select>
							</div>
							<button
								v-if="member.role !== 'owner'"
								@click="handleRemoveMember(member.id)"
								class="remove-member-btn"
							>
								<Icon name="mdi:close" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div v-if="activeTab === 'shared'" class="shared-section">
				<div v-if="!selectedTeam" class="no-team-selected">
					<p>Select a team to view shared templates</p>
				</div>

				<div v-else class="shared-templates">
					<h4 class="section-title">Shared Templates in {{ selectedTeam.name }}</h4>

					<div v-if="sharedTemplates.length > 0" class="shared-list">
						<div
							v-for="shared in sharedTemplates"
							:key="shared.id"
							class="shared-item"
						>
							<div class="shared-info">
								<span class="shared-template-id">{{ shared.templateId }}</span>
								<span class="shared-by">Shared by {{ shared.sharedBy }}</span>
								<span class="shared-date">
									{{ new Date(shared.sharedAt).toLocaleDateString() }}
								</span>
							</div>
							<div class="shared-permission">
								<select
									:value="shared.permission"
									@change="handleUpdatePermission(shared.id, $event.target.value as SharedTemplate['permission'])"
									class="permission-select"
								>
									<option value="read">Read</option>
									<option value="write">Write</option>
									<option value="admin">Admin</option>
								</select>
								<button
									@click="handleUnshare(shared.id)"
									class="unshare-btn"
								>
									<Icon name="mdi:link-off" />
								</button>
							</div>
						</div>
					</div>

					<div v-else class="no-shared">
						<p>No templates shared with this team yet</p>
					</div>
				</div>
			</div>
		</div>

		<Dialog v-model:open="showCreateTeamDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Team</DialogTitle>
				</DialogHeader>
				<div class="dialog-form">
					<div class="form-group">
						<label class="form-label">Team Name</label>
						<input
							v-model="newTeamName"
							type="text"
							class="form-input"
							placeholder="My Team"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" @click="showCreateTeamDialog = false">
						Cancel
					</Button>
					Button
						:disabled="!newTeamName.trim()"
						@click="handleCreateTeam"
					>
						Create Team
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		<Dialog v-model:open="showAddMemberDialog">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Team Member</DialogTitle>
				</DialogHeader>
				<div class="dialog-form">
					<div class="form-group">
						<label class="form-label">Name</label>
						<input
							v-model="newMemberName"
							type="text"
							class="form-input"
							placeholder="John Doe"
						/>
					</div>
					<div class="form-group">
						<label class="form-label">Email</label>
						<input
							v-model="newMemberEmail"
							type="email"
							class="form-input"
							placeholder="john@example.com"
						/>
					</div>
					<div class="form-group">
						<label class="form-label">Role</label>
						<select v-model="newMemberRole" class="form-input">
							<option value="viewer">Viewer</option>
							<option value="editor">Editor</option>
							<option value="admin">Admin</option>
						</select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" @click="showAddMemberDialog = false">
						Cancel
					</Button>
					<Button
						:disabled="!newMemberName.trim() || !newMemberEmail.trim()"
						@click="handleAddMember"
					>
						Add Member
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>

<style scoped>
.sharing-panel {
	@apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.sharing-header {
	@apply mb-4 flex items-center justify-between;
}

.sharing-content {
	@apply space-y-4;
}

.tabs {
	@apply flex gap-2 rounded-lg bg-gray-100 p-1;
}

.tab {
	@apply rounded-md px-4 py-2 text-sm font-medium transition-colors;
}

.tab.active {
	@apply bg-white text-primary shadow-sm;
}

.teams-section,
.shared-section {
	@apply space-y-4;
}

.teams-header {
	@apply flex items-center justify-between;
}

.section-title {
	@apply text-sm font-semibold text-gray-700;
}

.create-team-btn,
.add-member-btn {
	@apply flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm text-white transition-colors hover:bg-primary/90;
}

.teams-list {
	@apply space-y-2;
}

.team-card {
	@apply cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-primary/50;
}

.team-card.active {
	@apply border-primary bg-primary/5;
}

.team-info {
	@apply flex items-center justify-between;
}

.team-name {
	@apply font-semibold text-gray-900;
}

.team-members {
	@apply text-sm text-gray-600;
}

.team-actions {
	@apply flex gap-2;
}

.delete-btn {
	@apply rounded-lg p-1.5 text-red-600 hover:bg-red-50;
}

.no-teams,
.no-team-selected,
.no-shared {
	@apply rounded-lg bg-gray-50 p-6 text-center text-gray-600;
}

.team-details {
	@apply rounded-lg bg-gray-50 p-4;
}

.team-details-header {
	@apply mb-4 flex items-center justify-between;
}

.team-details-title {
	@apply font-semibold text-gray-900;
}

.members-list {
	@apply space-y-3;
}

.member-item {
	@apply flex items-center gap-3 rounded-lg bg-white p-3;
}

.member-info {
	@apply flex items-center gap-3;
}

.member-avatar {
	@apply flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold;
}

.member-details {
	@apply flex flex-col;
}

.member-name {
	@apply font-medium text-gray-900;
}

.member-email {
	@apply text-sm text-gray-600;
}

.member-role {
	@apply flex-1;
}

.role-select,
.permission-select {
	@apply rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}

.remove-member-btn,
.unshare-btn {
	@apply rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-red-600;
}

.shared-templates {
	@apply space-y-3;
}

.shared-list {
	@apply space-y-2;
}

.shared-item {
	@apply flex items-center justify-between rounded-lg border border-gray-200 p-4;
}

.shared-info {
	@apply flex flex-col gap-1;
}

.shared-template-id {
	@apply font-medium text-gray-900;
}

.shared-by,
.shared-date {
	@apply text-sm text-gray-600;
}

.shared-permission {
	@apply flex items-center gap-2;
}

.dialog-form {
	@apply space-y-4;
}

.form-group {
	@apply space-y-2;
}

.form-label {
	@apply text-sm font-medium text-gray-700;
}

.form-input {
	@apply w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20;
}
</style>
