export class TemplateError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'TemplateError'
  }
}

export class FileNotFoundError extends TemplateError {
  constructor(path: string) {
    super(`File or directory not found: ${path}`, 'FILE_NOT_FOUND')
    this.name = 'FileNotFoundError'
  }
}

export class TemplateNotFoundError extends TemplateError {
  constructor(templateName: string) {
    super(`Template "${templateName}" not found`, 'TEMPLATE_NOT_FOUND')
    this.name = 'TemplateNotFoundError'
  }
}

export class InvalidProjectNameError extends TemplateError {
  constructor(name: string, reason: string) {
    super(`Invalid project name "${name}": ${reason}`, 'INVALID_PROJECT_NAME')
    this.name = 'InvalidProjectNameError'
  }
}

export class GitSubmoduleError extends TemplateError {
  constructor(message: string) {
    super(message, 'GIT_SUBMODULE_ERROR')
    this.name = 'GitSubmoduleError'
  }
}

export class SyncError extends TemplateError {
  constructor(message: string) {
    super(message, 'SYNC_ERROR')
    this.name = 'SyncError'
  }
}
