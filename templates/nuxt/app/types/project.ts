export type Project = {
	id: number;
	name: string;
	url: string;
	repo: string;
	status:
		| "Production"
		| "Development"
		| "Staging"
		| "Setup required"
		| "Error"
		| "Unknown"
		| "Pending"
		| "Success"
		| "Failed"
		| "Canceled"
		| "Deploying"
		| "Idle"
		| "Building"
		| "Queued"
		| "Running"
		| "Stopping"
		| "Stopped"
		| "Terminated"
		| "Succeeded"
		| "Timeout"
		| "Skipped"
		| "Not started"
		| "In progress"
		| "Waiting for approval"
		| "Approved"
		| "Rejected"
		| "Draft"
		| "Published"
		| "Unpublished"
		| "Archived"
		| "Deleted";
	lastDeploy: string;
	updatedAt: string;
	icon: string;
};
