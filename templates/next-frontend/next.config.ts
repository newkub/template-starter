import MillionLint from "@million/lint";
import UnoCss from "@unocss/webpack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	webpack: (config) => {
		config.cache = false;
		config.plugins.push(UnoCss());
		return config;
	},
};

export default MillionLint.next({ rsc: true })(nextConfig);
