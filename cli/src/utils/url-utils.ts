/**
 * Custom function to open URLs using Bun
 */
export async function openUrl(url: string): Promise<void> {
  try {
    // Try different commands based on the platform
    if (process.platform === 'win32') {
      // Windows - use cmd /c start to properly open URLs
      await Bun.$`cmd /c start ${url}`.quiet()
    } else if (process.platform === 'darwin') {
      // macOS
      await Bun.$`open "${url}"`.quiet()
    } else {
      // Linux and others
      await Bun.$`xdg-open "${url}"`.quiet()
    }
  } catch (error) {
    // We are deliberately ignoring the log service here to keep this util decoupled
    console.warn(`Could not open URL automatically. Please visit: ${url}`)
    // Log the error for debugging purposes
    console.debug('Error opening URL:', error)
  }
}
