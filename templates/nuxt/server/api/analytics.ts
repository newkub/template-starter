export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const _range = query.range || "7days";

	// Mock data
	const data = {
		visitors: 1245,
		pageViews: 5678,
		bounceRate: 0.42,
		avgSessionDuration: 186,
		trafficSources: {
			direct: 35,
			organic: 45,
			referral: 12,
			social: 8,
		},
		chartData: Array.from({ length: 7 }, (_, i) => ({
			date: new Date(Date.now() - (6 - i) * 86400000)
				.toISOString()
				.split("T")[0],
			visitors: Math.floor(Math.random() * 200) + 50,
			pageViews: Math.floor(Math.random() * 800) + 100,
		})),
	};

	return data;
});
