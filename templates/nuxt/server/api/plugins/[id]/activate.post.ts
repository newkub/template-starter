export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	// TODO: Implement actual plugin activation logic
	return { success: true, message: `Plugin ${id} activated` };
});
