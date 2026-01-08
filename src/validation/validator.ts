import type {
  ValidationErrors,
  ValidationSchema,
  ValidateFn,
  ValidateAsyncFn,
  StepDefinition,
} from '../types.js'
import { validateSchema } from './rules.js'

/**
 * Validation engine - orchestrates all validation types
 */
export class ValidationEngine<TData = Record<string, unknown>> {
  /**
   * Validate using function
   * @param data - Form data
   * @param validator - Validation function
   * @returns Validation errors or null
   */
  validate(
    data: TData,
    validator?: ValidateFn<TData>
  ): ValidationErrors | null {
    if (!validator) return null
    return validator(data)
  }

  /**
   * Validate using async function
   * @param data - Form data
   * @param validator - Async validation function
   * @returns Promise resolving to validation errors or null
   */
  async validateAsync(
    data: TData,
    validator?: ValidateAsyncFn<TData>
  ): Promise<ValidationErrors | null> {
    if (!validator) return null
    return await validator(data)
  }

  /**
   * Validate using schema
   * @param data - Form data
   * @param schema - Validation schema
   * @returns Validation errors or null
   */
  validateSchema(
    data: TData,
    schema: ValidationSchema
  ): ValidationErrors | null {
    return validateSchema(data as Record<string, unknown>, schema)
  }

  /**
   * Validate using all available methods (schema, function, async)
   * @param data - Form data
   * @param step - Step definition with validators
   * @returns Promise resolving to combined validation errors or null
   */
  async validateAll(
    data: TData,
    step: StepDefinition<TData>
  ): Promise<ValidationErrors | null> {
    const errors: ValidationErrors = {}

    // 1. Schema validation
    if (step.schema) {
      const schemaErrors = this.validateSchema(data, step.schema)
      if (schemaErrors) {
        Object.assign(errors, schemaErrors)
      }
    }

    // 2. Function validation
    if (step.validate) {
      const fnErrors = this.validate(data, step.validate)
      if (fnErrors) {
        Object.assign(errors, fnErrors)
      }
    }

    // 3. Async validation
    if (step.validateAsync) {
      const asyncErrors = await this.validateAsync(data, step.validateAsync)
      if (asyncErrors) {
        Object.assign(errors, asyncErrors)
      }
    }

    return Object.keys(errors).length > 0 ? errors : null
  }

  /**
   * Validate multiple fields and return field-specific errors
   * @param data - Form data
   * @param fields - Fields to validate
   * @param schema - Validation schema
   * @returns Map of field names to error messages
   */
  validateFields(
    data: TData,
    fields: string[],
    schema: ValidationSchema
  ): Map<string, string> {
    const errors = new Map<string, string>()

    for (const field of fields) {
      if (schema[field]) {
        const fieldErrors = this.validateSchema(
          { [field]: (data as Record<string, unknown>)[field] } as TData,
          { [field]: schema[field] }
        )
        if (fieldErrors && fieldErrors[field]) {
          errors.set(field, fieldErrors[field])
        }
      }
    }

    return errors
  }

  /**
   * Check if data is valid based on schema
   * @param data - Form data
   * @param schema - Validation schema
   * @returns True if valid
   */
  isValid(
    data: TData,
    schema?: ValidationSchema
  ): boolean {
    if (!schema) return true
    const errors = this.validateSchema(data, schema)
    return errors === null
  }

  /**
   * Get first error message for a field
   * @param errors - Validation errors
   * @param field - Field name
   * @returns Error message or undefined
   */
  getFirstError(
    errors: ValidationErrors | null,
    field: string
  ): string | undefined {
    if (!errors) return undefined
    return errors[field]
  }

  /**
   * Get all error messages as an array
   * @param errors - Validation errors
   * @returns Array of error messages
   */
  getErrorMessages(errors: ValidationErrors | null): string[] {
    if (!errors) return []
    return Object.values(errors)
  }

  /**
   * Check if there are any errors
   * @param errors - Validation errors
   * @returns True if there are errors
   */
  hasErrors(errors: ValidationErrors | null): boolean {
    return errors !== null && Object.keys(errors).length > 0
  }
}

/**
 * Create a validation engine instance
 * @returns New ValidationEngine instance
 */
export function createValidationEngine<
  TData = Record<string, unknown>
>(): ValidationEngine<TData> {
  return new ValidationEngine<TData>()
}
