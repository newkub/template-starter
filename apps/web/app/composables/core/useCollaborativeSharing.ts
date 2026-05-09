import type { Team, TeamMember, SharedTemplate } from "#shared/types/template";

export const useCollaborativeSharing = () => {
	const STORAGE_KEY_TEAMS = "teams";
	const STORAGE_KEY_SHARED = "shared-templates";

	const getTeams = (): Team[] => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY_TEAMS);
			return data ? JSON.parse(data) : [];
		}
		return [];
	};

	const getTeamById = (teamId: string): Team | null => {
		const teams = getTeams();
		return teams.find((t) => t.id === teamId) || null;
	};

	const createTeam = (name: string, ownerId: string, ownerName: string, ownerEmail: string): Team => {
		const teams = getTeams();

		const newTeam: Team = {
			id: `team-${Date.now()}`,
			name,
			members: [
				{
					id: ownerId,
					name: ownerName,
					email: ownerEmail,
					role: "owner",
					joinedAt: new Date().toISOString(),
				},
			],
			createdAt: new Date().toISOString(),
		};

		teams.push(newTeam);

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
		}

		return newTeam;
	};

	const addTeamMember = (
		teamId: string,
		memberId: string,
		name: string,
		email: string,
		role: TeamMember["role"] = "viewer",
	): boolean => {
		const teams = getTeams();
		const teamIndex = teams.findIndex((t) => t.id === teamId);

		if (teamIndex === -1) return false;

		const team = teams[teamIndex];

		if (team.members.some((m) => m.id === memberId)) return false;

		team.members.push({
			id: memberId,
			name,
			email,
			role,
			joinedAt: new Date().toISOString(),
		});

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
		}

		return true;
	};

	const updateTeamMemberRole = (
		teamId: string,
		memberId: string,
		newRole: TeamMember["role"],
	): boolean => {
		const teams = getTeams();
		const teamIndex = teams.findIndex((t) => t.id === teamId);

		if (teamIndex === -1) return false;

		const team = teams[teamIndex];
		const memberIndex = team.members.findIndex((m) => m.id === memberId);

		if (memberIndex === -1) return false;

		const member = team.members[memberIndex];

		if (member.role === "owner") return false;

		member.role = newRole;

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
		}

		return true;
	};

	const removeTeamMember = (teamId: string, memberId: string): boolean => {
		const teams = getTeams();
		const teamIndex = teams.findIndex((t) => t.id === teamId);

		if (teamIndex === -1) return false;

		const team = teams[teamIndex];
		const memberIndex = team.members.findIndex((m) => m.id === memberId);

		if (memberIndex === -1) return false;

		const member = team.members[memberIndex];

		if (member.role === "owner") return false;

		team.members.splice(memberIndex, 1);

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
		}

		return true;
	};

	const deleteTeam = (teamId: string): boolean => {
		const teams = getTeams();
		const teamIndex = teams.findIndex((t) => t.id === teamId);

		if (teamIndex === -1) return false;

		teams.splice(teamIndex, 1);

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
		}

		return true;
	};

	const getSharedTemplates = (): SharedTemplate[] => {
		if (import.meta.client) {
			const data = localStorage.getItem(STORAGE_KEY_SHARED);
			return data ? JSON.parse(data) : [];
		}
		return [];
	};

	const getSharedTemplatesByTeam = (teamId: string): SharedTemplate[] => {
		const shared = getSharedTemplates();
		return shared.filter((s) => s.teamId === teamId);
	};

	const getSharedTemplatesByTemplate = (templateId: string): SharedTemplate[] => {
		const shared = getSharedTemplates();
		return shared.filter((s) => s.templateId === templateId);
	};

	const shareTemplate = (
		templateId: string,
		teamId: string,
		sharedBy: string,
		permission: SharedTemplate["permission"] = "read",
	): SharedTemplate | null => {
		const teams = getTeams();
		const team = teams.find((t) => t.id === teamId);

		if (!team) return null;

		const shared = getSharedTemplates();

		const existing = shared.find(
			(s) => s.templateId === templateId && s.teamId === teamId,
		);

		if (existing) return null;

		const newShared: SharedTemplate = {
			id: `shared-${Date.now()}`,
			templateId,
			teamId,
			sharedBy,
			permission,
			sharedAt: new Date().toISOString(),
		};

		shared.push(newShared);

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_SHARED, JSON.stringify(shared));
		}

		return newShared;
	};

	const updateSharedPermission = (
		sharedId: string,
		newPermission: SharedTemplate["permission"],
	): boolean => {
		const shared = getSharedTemplates();
		const sharedIndex = shared.findIndex((s) => s.id === sharedId);

		if (sharedIndex === -1) return false;

		shared[sharedIndex].permission = newPermission;

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_SHARED, JSON.stringify(shared));
		}

		return true;
	};

	const unshareTemplate = (sharedId: string): boolean => {
		const shared = getSharedTemplates();
		const sharedIndex = shared.findIndex((s) => s.id === sharedId);

		if (sharedIndex === -1) return false;

		shared.splice(sharedIndex, 1);

		if (import.meta.client) {
			localStorage.setItem(STORAGE_KEY_SHARED, JSON.stringify(shared));
		}

		return true;
	};

	const canAccessTemplate = (
		templateId: string,
		teamId: string,
		memberId: string,
	): { canAccess: boolean; permission?: SharedTemplate["permission"] } => {
		const shared = getSharedTemplates();
		const sharedTemplate = shared.find(
			(s) => s.templateId === templateId && s.teamId === teamId,
		);

		if (!sharedTemplate) return { canAccess: false };

		const team = getTeamById(teamId);
		if (!team) return { canAccess: false };

		const member = team.members.find((m) => m.id === memberId);
		if (!member) return { canAccess: false };

		const permission = sharedTemplate.permission;

		if (member.role === "owner" || member.role === "admin") {
			return { canAccess: true, permission: "admin" as const };
		}

		if (member.role === "editor") {
			if (permission === "read") {
				return { canAccess: true, permission: "read" as const };
			}
			return { canAccess: true, permission };
		}

		if (member.role === "viewer") {
			return { canAccess: true, permission: "read" as const };
		}

		return { canAccess: false };
	};

	const getUserTeams = (userId: string): Team[] => {
		const teams = getTeams();
		return teams.filter((t) => t.members.some((m) => m.id === userId));
	};

	return {
		getTeams,
		getTeamById,
		createTeam,
		addTeamMember,
		updateTeamMemberRole,
		removeTeamMember,
		deleteTeam,
		getSharedTemplates,
		getSharedTemplatesByTeam,
		getSharedTemplatesByTemplate,
		shareTemplate,
		updateSharedPermission,
		unshareTemplate,
		canAccessTemplate,
		getUserTeams,
	};
};
