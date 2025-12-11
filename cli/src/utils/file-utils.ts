import { log } from '@clack/prompts'

/**
 * Copy a directory recursively from source to destination using Bun APIs
 */
export async function copyDir(src: string, dest: string): Promise<void> {
  try {
    // Use shell commands for recursive copy as Bun doesn't have a direct equivalent
    // This is the most reliable way to copy directories in Bun
    const result = await Bun.$`mkdir -p ${dest} && cp -r ${src}/* ${dest}/ 2>/dev/null || cp -r ${src}/.??* ${dest}/ 2>/dev/null || true`.quiet()
    if (result.exitCode !== 0 && result.exitCode !== 1) {
      throw new Error(`Failed to copy directory: ${result.stderr.toString()}`)
    }
  } catch (error) {
    console.error('Error copying directory:', error)
    throw error
  }
}

/**
 * Update project package.json with new project name
 */
export async function updateProjectPackageJson(projectPath: string, projectName: string): Promise<void> {
  const packageJsonPath = `${projectPath}/package.json`
  
  try {
    // Check if file exists using Bun
    const file = Bun.file(packageJsonPath)
    if (!(await file.exists())) {
      log.warn('Could not update package.json - this may be normal for some templates')
      return
    }
    
    const packageJsonContent = await file.text()
    const packageJson = JSON.parse(packageJsonContent)
    
    // Update name field
    packageJson.name = projectName
    
    // Remove version field if it exists (let user set it)
    if (packageJson.version) {
      packageJson.version = '0.0.0'
    }
    
    // Write updated package.json using Bun
    await Bun.write(packageJsonPath, JSON.stringify(packageJson, null, 2))
  } catch (_error) {
    // package.json doesn't exist or other error, which is fine
    log.warn('Could not update package.json - this may be normal for some templates')
    // Log the error for debugging purposes
    console.debug('Error updating package.json:', _error)
  }
}
