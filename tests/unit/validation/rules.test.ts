import { describe, it, expect } from 'vitest'
import {
  validationRules,
  validateField,
  validateSchema,
  getErrorMessage,
} from '../../../src/validation/rules.js'
import type { FieldValidation } from '../../../src/types.js'

describe('Validation Rules', () => {
  describe('required', () => {
    const validation: FieldValidation = { required: true }

    it('should pass non-empty values', () => {
      expect(validationRules.required('hello')).toBe(true)
      expect(validationRules.required(0)).toBe(true)
      expect(validationRules.required(false)).toBe(true)
      expect(validationRules.required(['item'])).toBe(true)
    })

    it('should fail empty values', () => {
      expect(validationRules.required(null)).toBe(false)
      expect(validationRules.required(undefined)).toBe(false)
      expect(validationRules.required('')).toBe(false)
      expect(validationRules.required([])).toBe(false)
    })
  })

  describe('minLength', () => {
    const validation: FieldValidation = { minLength: 3 }

    it('should pass values with sufficient length', () => {
      expect(validationRules.minLength('abc', 3)).toBe(true)
      expect(validationRules.minLength('abcd', 3)).toBe(true)
    })

    it('should fail values with insufficient length', () => {
      expect(validationRules.minLength('ab', 3)).toBe(false)
      expect(validationRules.minLength('', 3)).toBe(false)
    })

    it('should fail non-string values', () => {
      expect(validationRules.minLength(123, 3)).toBe(false)
      expect(validationRules.minLength(null, 3)).toBe(false)
    })
  })

  describe('maxLength', () => {
    const validation: FieldValidation = { maxLength: 5 }

    it('should pass values within limit', () => {
      expect(validationRules.maxLength('abc', 5)).toBe(true)
      expect(validationRules.maxLength('abcde', 5)).toBe(true)
    })

    it('should fail values exceeding limit', () => {
      expect(validationRules.maxLength('abcdef', 5)).toBe(false)
    })

    it('should fail non-string values', () => {
      expect(validationRules.maxLength(123, 5)).toBe(false)
    })
  })

  describe('min', () => {
    const validation: FieldValidation = { min: 18 }

    it('should pass values at or above minimum', () => {
      expect(validationRules.min(18, 18)).toBe(true)
      expect(validationRules.min(21, 18)).toBe(true)
    })

    it('should fail values below minimum', () => {
      expect(validationRules.min(17, 18)).toBe(false)
      expect(validationRules.min(0, 18)).toBe(false)
    })

    it('should fail non-number values', () => {
      expect(validationRules.min('18', 18)).toBe(false)
    })
  })

  describe('max', () => {
    const validation: FieldValidation = { max: 100 }

    it('should pass values at or below maximum', () => {
      expect(validationRules.max(100, 100)).toBe(true)
      expect(validationRules.max(50, 100)).toBe(true)
    })

    it('should fail values above maximum', () => {
      expect(validationRules.max(101, 100)).toBe(false)
    })

    it('should fail non-number values', () => {
      expect(validationRules.max('100', 100)).toBe(false)
    })
  })

  describe('pattern', () => {
    const validation: FieldValidation = { pattern: /^\d{3}-\d{3}-\d{4}$/ }

    it('should pass matching patterns', () => {
      expect(validationRules.pattern('123-456-7890', /^\d{3}-\d{3}-\d{4}$/)).toBe(
        true
      )
    })

    it('should fail non-matching patterns', () => {
      expect(validationRules.pattern('1234567890', /^\d{3}-\d{3}-\d{4}$/)).toBe(
        false
      )
      expect(validationRules.pattern('abc-def-ghij', /^\d{3}-\d{3}-\d{4}$/)).toBe(
        false
      )
    })

    it('should fail non-string values', () => {
      expect(validationRules.pattern(1234567890, /^\d{3}-\d{3}-\d{4}$/)).toBe(
        false
      )
    })
  })

  describe('email', () => {
    it('should pass valid email addresses', () => {
      expect(validationRules.email('test@example.com')).toBe(true)
      expect(validationRules.email('user.name@domain.co.uk')).toBe(true)
    })

    it('should fail invalid email addresses', () => {
      expect(validationRules.email('invalid')).toBe(false)
      expect(validationRules.email('test@')).toBe(false)
      expect(validationRules.email('@example.com')).toBe(false)
      expect(validationRules.email('test@.com')).toBe(false)
    })
  })

  describe('url', () => {
    it('should pass valid URLs', () => {
      expect(validationRules.url('https://example.com')).toBe(true)
      expect(validationRules.url('http://localhost:3000')).toBe(true)
      expect(validationRules.url('ftp://files.example.com')).toBe(true)
    })

    it('should fail invalid URLs', () => {
      expect(validationRules.url('not-a-url')).toBe(false)
      expect(validationRules.url('example.com')).toBe(false)
    })
  })

  describe('custom', () => {
    const isEven = (value: unknown) => typeof value === 'number' && value % 2 === 0

    it('should pass when custom function returns true', () => {
      expect(validationRules.custom(4, isEven, {})).toBe(true)
    })

    it('should fail when custom function returns false', () => {
      expect(validationRules.custom(3, isEven, {})).toBe(false)
    })
  })
})

describe('validateField', () => {
  it('should validate required field', () => {
    const validation: FieldValidation = { required: true }

    expect(validateField('', validation, {})).toBe('Field is required')
    expect(validateField('value', validation, {})).toBeNull()
  })

  it('should validate minLength', () => {
    const validation: FieldValidation = { minLength: 3 }

    expect(validateField('ab', validation, {})).toBe(
      'Must be at least 3 characters'
    )
    expect(validateField('abc', validation, {})).toBeNull()
  })

  it('should validate maxLength', () => {
    const validation: FieldValidation = { maxLength: 5 }

    expect(validateField('abcdef', validation, {})).toBe(
      'Must be at most 5 characters'
    )
    expect(validateField('abc', validation, {})).toBeNull()
  })

  it('should validate min', () => {
    const validation: FieldValidation = { min: 18 }

    expect(validateField(17, validation, {})).toBe('Must be at least 18')
    expect(validateField(18, validation, {})).toBeNull()
  })

  it('should validate max', () => {
    const validation: FieldValidation = { max: 100 }

    expect(validateField(101, validation, {})).toBe('Must be at most 100')
    expect(validateField(100, validation, {})).toBeNull()
  })

  it('should validate pattern', () => {
    const validation: FieldValidation = { pattern: /^\d+$/ }

    expect(validateField('abc', validation, {})).toBe(
      'Must match the required pattern'
    )
    expect(validateField('123', validation, {})).toBeNull()
  })

  it('should validate email', () => {
    const validation: FieldValidation = { email: true }

    expect(validateField('invalid', validation, {})).toBe(
      'Must be a valid email address'
    )
    expect(validateField('test@example.com', validation, {})).toBeNull()
  })

  it('should validate url', () => {
    const validation: FieldValidation = { url: true }

    expect(validateField('not-a-url', validation, {})).toBe(
      'Must be a valid URL'
    )
    expect(validateField('https://example.com', validation, {})).toBeNull()
  })

  it('should use custom error message', () => {
    const validation: FieldValidation = {
      required: true,
      message: 'This field is required',
    }

    expect(validateField('', validation, {})).toBe('This field is required')
  })

  it('should use rule-specific custom message', () => {
    const validation: FieldValidation = {
      required: true,
      messages: {
        required: 'Custom required message',
      },
    }

    expect(validateField('', validation, {})).toBe('Custom required message')
  })

  it('should skip validation if field is empty and not required', () => {
    const validation: FieldValidation = { minLength: 3 }

    expect(validateField('', validation, {})).toBeNull()
    expect(validateField(null, validation, {})).toBeNull()
    expect(validateField(undefined, validation, {})).toBeNull()
  })
})

describe('validateSchema', () => {
  it('should validate multiple fields', () => {
    const schema = {
      name: { required: true, minLength: 2 },
      age: { required: true, min: 18 },
    }

    const data = { name: '', age: 15 }
    const errors = validateSchema(data, schema)

    expect(errors).toEqual({
      name: 'Must be at least 2 characters',
      age: 'Must be at least 18',
    })
  })

  it('should return null if all validations pass', () => {
    const schema = {
      name: { required: true, minLength: 2 },
      age: { required: true, min: 18 },
    }

    const data = { name: 'John', age: 25 }
    const errors = validateSchema(data, schema)

    expect(errors).toBeNull()
  })

  it('should return empty object if no validations fail', () => {
    const schema = {}

    const data = { name: 'John', age: 25 }
    const errors = validateSchema(data, schema)

    expect(errors).toBeNull()
  })
})

describe('getErrorMessage', () => {
  it('should return rule-specific custom message', () => {
    const validation: FieldValidation = {
      messages: {
        required: 'Custom required message',
      },
    }

    expect(getErrorMessage('required', validation)).toBe(
      'Custom required message'
    )
  })

  it('should return general custom message', () => {
    const validation: FieldValidation = {
      message: 'General error message',
    }

    expect(getErrorMessage('required', validation)).toBe('General error message')
  })

  it('should return default message with placeholders', () => {
    const validation: FieldValidation = { minLength: 5 }

    expect(getErrorMessage('minLength', validation)).toBe(
      'Must be at least 5 characters'
    )
  })
})
