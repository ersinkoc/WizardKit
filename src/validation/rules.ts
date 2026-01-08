import type {
  ValidationRule,
  ValidationErrors,
  FieldValidation,
} from '../types.js'

/**
 * Default error messages for each validation rule
 */
export const defaultMessages: Record<ValidationRule, string> = {
  required: 'Field is required',
  minLength: 'Must be at least {minLength} characters',
  maxLength: 'Must be at most {maxLength} characters',
  min: 'Must be at least {min}',
  max: 'Must be at most {max}',
  pattern: 'Must match the required pattern',
  email: 'Must be a valid email address',
  url: 'Must be a valid URL',
  custom: 'Invalid value',
}

/**
 * Built-in validation rules
 */
export const validationRules = {
  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  },

  minLength: (value: unknown, min: number): boolean => {
    if (typeof value !== 'string') return false
    return value.length >= min
  },

  maxLength: (value: unknown, max: number): boolean => {
    if (typeof value !== 'string') return false
    return value.length <= max
  },

  min: (value: unknown, min: number): boolean => {
    if (typeof value !== 'number') return false
    return value >= min
  },

  max: (value: unknown, max: number): boolean => {
    if (typeof value !== 'number') return false
    return value <= max
  },

  pattern: (value: unknown, regex: RegExp): boolean => {
    if (typeof value !== 'string') return false
    return regex.test(value)
  },

  email: (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    // Simple email regex - covers most cases
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  url: (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },

  custom: (
    value: unknown,
    fn: (value: unknown, data: Record<string, unknown>) => boolean,
    data: Record<string, unknown>
  ): boolean => {
    return fn(value, data)
  },
}

/**
 * Get error message for a validation rule
 * @param rule - Validation rule
 * @param validation - Field validation config
 * @returns Error message
 */
export function getErrorMessage(
  rule: ValidationRule,
  validation: FieldValidation
): string {
  // Check for custom message for this specific rule
  if (validation.messages?.[rule]) {
    return validation.messages[rule]!
  }

  // Check for general message
  if (validation.message) {
    return validation.message
  }

  // Use default message with placeholders
  let message = defaultMessages[rule]

  // Replace placeholders with actual values
  if (rule === 'minLength' && validation.minLength !== undefined) {
    message = message.replace('{minLength}', String(validation.minLength))
  }
  if (rule === 'maxLength' && validation.maxLength !== undefined) {
    message = message.replace('{maxLength}', String(validation.maxLength))
  }
  if (rule === 'min' && validation.min !== undefined) {
    message = message.replace('{min}', String(validation.min))
  }
  if (rule === 'max' && validation.max !== undefined) {
    message = message.replace('{max}', String(validation.max))
  }

  return message
}

/**
 * Validate a single field against its validation rules
 * @param value - Field value
 * @param validation - Field validation config
 * @param data - All form data
 * @returns Error message or null if valid
 */
export function validateField(
  value: unknown,
  validation: FieldValidation,
  data: Record<string, unknown>
): string | null {
  // Required check
  if (validation.required && !validationRules.required(value)) {
    return getErrorMessage('required', validation)
  }

  // Skip other validations if value is empty and not required
  if (
    !validation.required &&
    (value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'string' && value.trim() === ''))
  ) {
    return null
  }

  // Min length
  if (validation.minLength !== undefined) {
    if (!validationRules.minLength(value, validation.minLength)) {
      return getErrorMessage('minLength', validation)
    }
  }

  // Max length
  if (validation.maxLength !== undefined) {
    if (!validationRules.maxLength(value, validation.maxLength)) {
      return getErrorMessage('maxLength', validation)
    }
  }

  // Min
  if (validation.min !== undefined) {
    if (!validationRules.min(value, validation.min)) {
      return getErrorMessage('min', validation)
    }
  }

  // Max
  if (validation.max !== undefined) {
    if (!validationRules.max(value, validation.max)) {
      return getErrorMessage('max', validation)
    }
  }

  // Pattern
  if (validation.pattern) {
    if (!validationRules.pattern(value, validation.pattern)) {
      return getErrorMessage('pattern', validation)
    }
  }

  // Email
  if (validation.email && !validationRules.email(value)) {
    return getErrorMessage('email', validation)
  }

  // URL
  if (validation.url && !validationRules.url(value)) {
    return getErrorMessage('url', validation)
  }

  // Custom
  if (validation.custom && !validationRules.custom(value, validation.custom, data)) {
    return getErrorMessage('custom', validation)
  }

  return null
}

/**
 * Validate all fields in a schema
 * @param data - Form data
 * @param schema - Validation schema
 * @returns Validation errors or null if all valid
 */
export function validateSchema(
  data: Record<string, unknown>,
  schema: Record<string, FieldValidation>
): ValidationErrors | null {
  const errors: ValidationErrors = {}

  for (const [field, validation] of Object.entries(schema)) {
    const value = data[field]
    const error = validateField(value, validation, data)
    if (error) {
      errors[field] = error
    }
  }

  return Object.keys(errors).length > 0 ? errors : null
}
