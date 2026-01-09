import type { ServiceResponse } from '@moonrepo/types'

export function successResponse<T>(data: T, message?: string): ServiceResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function errorResponse(error: string, message?: string): ServiceResponse {
  return {
    success: false,
    error,
    message,
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
