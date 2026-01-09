export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  path: string
  message: string
  code: string
}

export interface ValidationWarning {
  path: string
  message: string
  code: string
}

export interface TemplateValidationRules {
  requiredFiles?: string[]
  requiredFolders?: string[]
  requiredConfigFiles?: string[]
  forbiddenPatterns?: string[]
}

export interface TemplateHealthStatus {
  templateName: string
  isHealthy: boolean
  issues: HealthIssue[]
  suggestions: string[]
  lastChecked?: string
}

export interface HealthIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  path?: string
  fixable: boolean
}
