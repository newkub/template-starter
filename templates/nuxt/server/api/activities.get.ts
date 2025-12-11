export default defineEventHandler(async (_event) => {
	// Mock data - replace with actual data from your database
	return [
		{
			id: "1",
			type: "deploy",
			message: "projects deployed successfully",
			timestamp: new Date().toISOString(),
			user: "admin",
		},
		{
			id: "2",
			type: "plugin",
			message: 'Plugin "SEO Pack" updated to v2.0',
			timestamp: new Date(Date.now() - 86400000).toISOString(),
			user: "admin",
		},
	];
});
