export default defineEventHandler(async (_event) => {
	// Mock data - replace with actual data from your database
	return [
		{
			id: "1",
			status: "success",
			timestamp: new Date().toISOString(),
			commitMessage: "Update homepage design",
			branch: "main",
			duration: 45,
			author: "John Doe",
			environment: "production",
			url: "https://example.com",
		},
		{
			id: "2",
			status: "failed",
			timestamp: new Date(Date.now() - 86400000).toISOString(),
			commitMessage: "Fix login bug",
			branch: "dev",
			duration: 120,
			author: "Jane Doe",
			environment: "staging",
			url: "https://staging.example.com",
		},
	];
});
