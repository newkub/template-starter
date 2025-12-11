export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	// TODO: Implement actual plugin deactivation logic
	return { success: true, message: `Plugin ${id} deactivated` };
});
