export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	// In a real app, you would trigger actual deployment here
	// This is just a mock response

	const newDeployment = {
		id: Math.random().toString(36).substring(2, 9),
		status: "success",
		timestamp: new Date().toISOString(),
		commitMessage: body.commitMessage || "Manual deployment",
		branch: body.branch || "main",
		duration: Math.floor(Math.random() * 60) + 30,
		author: body.author || "Unknown",
		environment: body.environment || "production",
		repository: body.repository || "Unknown",
		sha: body.sha || "Unknown",
	};

	return newDeployment;
});
