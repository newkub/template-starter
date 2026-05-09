import type { DocumentationConfig, TemplateConfig, TemplateFile } from "#shared/types/template";
import { useTemplateGenerator } from "./useTemplateGenerator";

export const useDocumentationGenerator = () => {
	const generateDocumentation = (
		config: TemplateConfig,
		docConfig: DocumentationConfig,
	): TemplateFile[] => {
		const files: TemplateFile[] = [];

		if (docConfig.includeReadme) {
			files.push(generateReadme(config));
		}

		if (docConfig.includeChangelog) {
			files.push(generateChangelog());
		}

		if (docConfig.includeContributing) {
			files.push(generateContributing());
		}

		if (docConfig.includeLicense) {
			files.push(generateLicense());
		}

		if (docConfig.customSections && docConfig.customSections.length > 0) {
			docConfig.customSections.forEach((section) => {
				files.push(generateCustomSection(section.title, section.content));
			});
		}

		return files;
	};

	const generateReadme = (config: TemplateConfig): TemplateFile => {
		const { generateTemplate } = useTemplateGenerator();
		const template = generateTemplate(config);

		const libraries = config.libraries.join(", ");
		const ecosystem = config.ecosystem.toUpperCase();
		const packageManager = config.packageManager || "npm";

		const content = `# ${ecosystem} Template

A modern ${ecosystem} template with ${libraries}.

## Features

- Built with ${ecosystem}
- Includes: ${libraries}
- Optimized for production
- TypeScript support
- Modern tooling

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1+
- ${packageManager}

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd <project-name>

# Install dependencies
${packageManager} install
\`\`\`

### Development

\`\`\`bash
# Start development server
${template.commands.dev}
\`\`\`

### Build

\`\`\`bash
# Build for production
${template.commands.build}
\`\`\`

## Project Structure

\`\`\`
.
├── src/           # Source code
├── public/        # Static assets
├── tests/         # Test files
└── package.json   # Dependencies
\`\`\`

## Libraries Used

${config.libraries.map((lib) => `- ${lib}`).join("\n")}

## Scripts

\`\`\`json
{
  "dev": "${template.commands.dev}",
  "build": "${template.commands.build}",
  "start": "${template.commands.install}"
}
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@example.com or open an issue in the repository.
`;

		return {
			path: "README.md",
			content,
			type: "markdown",
		};
	};

	const generateChangelog = (): TemplateFile => {
		const content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial template setup
- Basic project structure

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [1.0.0] - ${new Date().toISOString().split("T")[0]}

### Added
- Initial release
- Core features implemented
`;

		return {
			path: "CHANGELOG.md",
			content,
			type: "markdown",
		};
	};

	const generateContributing = (): TemplateFile => {
		const content = `# Contributing

Thank you for your interest in contributing to this project!

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that the problem has already been reported.

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
`;

		return {
			path: "CONTRIBUTING.md",
			content,
			type: "markdown",
		};
	};

	const generateLicense = (): TemplateFile => {
		const year = new Date().getFullYear();

		const content = `MIT License

Copyright (c) ${year} [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

		return {
			path: "LICENSE",
			content,
			type: "markdown",
		};
	};

	const generateCustomSection = (title: string, content: string): TemplateFile => {
		const filename = title.toLowerCase().replace(/\s+/g, "-") + ".md";

		return {
			path: filename,
			content: `# ${title}\n\n${content}`,
			type: "markdown",
		};
	};

	const generateApiDocs = (config: TemplateConfig): TemplateFile => {
		const content = `# API Documentation

This document describes the API endpoints and their usage.

## Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

## Endpoints

### GET /api/health

Health check endpoint.

**Response:**
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

## Authentication

If your template includes authentication, describe it here.

## Error Handling

All errors follow this format:

\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
\`\`\`
`;

		return {
			path: "docs/API.md",
			content,
			type: "markdown",
		};
	};

	const generateDeploymentGuide = (): TemplateFile => {
		const content = `# Deployment Guide

This guide covers deploying your ${_config.ecosystem} application.

## Prerequisites

- A hosting account (Vercel, Netlify, or Cloudflare Pages)
- Git repository

## Deployment Options

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure build settings
4. Deploy

### Netlify

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Configure build settings
4. Deploy

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository in Cloudflare Pages
3. Configure build settings
4. Deploy

## Environment Variables

Configure these environment variables in your hosting platform:

\`\`\`
NODE_ENV=production
API_URL=your-api-url
\`\`\`

## Build Commands

\`\`\`bash
npm run build
\`\`\`

## Post-Deployment

After deployment, verify:

- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] Environment variables are set
- [ ] Error logging is working
`;

		return {
			path: "docs/DEPLOYMENT.md",
			content,
			type: "markdown",
		};
	};

	return {
		generateDocumentation,
		generateReadme,
		generateChangelog,
		generateContributing,
		generateLicense,
		generateCustomSection,
		generateApiDocs,
		generateDeploymentGuide,
	};
};
