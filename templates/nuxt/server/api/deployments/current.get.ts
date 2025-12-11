export default defineEventHandler(async (_event) => {
	// Mock data - replace with actual data from your database
	return {
		id: "1",
		status: "success",
		timestamp: new Date().toISOString(),
		commitMessage: "Update homepage design",
		branch: "main",
		duration: 45,
		author: "John Doe",
		environment: "production",
		repository: "my-repo",
		url: "https://example.com",
	};
});
