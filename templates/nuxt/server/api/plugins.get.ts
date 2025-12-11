export default defineEventHandler(async (_event) => {
	// Mock data - replace with actual data from your plugins
	return [
		{
			id: "1",
			name: "SEO Pack",
			description: "Improve your site SEO",
			version: "2.0",
			isActive: true,
			hasUpdate: false,
		},
		{
			id: "2",
			name: "Security Scanner",
			description: "Scan for security vulnerabilities",
			version: "1.5",
			isActive: false,
			hasUpdate: true,
		},
	];
});
