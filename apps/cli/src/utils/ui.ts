export const ui = {
	info(message: string): void {
		console.log(message);
	},
	success(message: string): void {
		console.log(`✓ ${message}`);
	},
	warn(message: string): void {
		console.warn(`! ${message}`);
	},
	error(message: string): void {
		console.error(`✗ ${message}`);
	},
	dim(message: string): void {
		console.log(`  ${message}`);
	},
	divider(): void {
		console.log("─".repeat(48));
	},
};
