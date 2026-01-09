import sidebarCLI from "../sidebar/sidebarCLI";
import sidebarNext from "../sidebar/sidebarNext";
import sidebarNuxt from "../sidebar/sidebarNuxt";
import sidebarReact from "../sidebar/sidebarReact";
import sidebarVitePress from "../sidebar/sidebarVitePress";
import sidebarVue from "../sidebar/sidebarVue";
import type { SidebarConfig } from "../types/sidebar";

// Mock functions for missing sidebar files
const mockSidebar = () => [];

export const sidebar: SidebarConfig = {
	"/courses/cli": {
		logo: "",
		items: sidebarCLI(),
	},
	"/courses/nextjs": {
		logo: "https://nextjs.org/favicon.ico",
		items: sidebarNext(),
	},
	"/courses/nuxt": {
		logo: "https://nuxt.com/icon.png",
		items: sidebarNuxt(),
	},
	"/courses/react": {
		logo: "https://onlyweb-formation.com/uploads/mod_logo/react.webp",
		items: sidebarReact(),
	},
	"/courses/vitepress": {
		logo: "https://vitepress.dev/vitepress-logo-large.webp",
		items: sidebarVitePress(),
	},
	"/courses/vue": {
		logo: "https://vuejs.org/logo.svg",
		items: sidebarVue(),
	},
};
