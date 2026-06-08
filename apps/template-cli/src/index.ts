export { TemplateService } from "./services/template.js";
export { TemplateRegistry } from "./services/registry.js";
export * from "./types/index.js";
export * from "./utils/errors.js";
export {
	copyDirectory,
	describeDirectory,
	ensureDir,
	isDirectory,
	listDirectories,
	pathExists,
	relativeToCwd,
} from "./utils/fs.js";
export {
	getBundledTemplatePath,
	getBundledTemplatesDir,
	getUserRegistryDir,
	getUserTemplatePath,
} from "./utils/paths.js";
export { buildProgram } from "./program.js";
