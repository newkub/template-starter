import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	return (
		<div class="h-screen w-full flex items-center justify-center bg-slate-900 text-white">
			<div class="text-center">
				<h1 class="text-4xl font-bold font-mono mb-4">Template Starter</h1>
				<p class="text-lg text-gray-300">Migrated from SolidStart/Vinxi to TanStack Start</p>
			</div>
		</div>
	);
}
