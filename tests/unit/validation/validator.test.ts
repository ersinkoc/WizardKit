import { describe, it, expect, vi } from 'vitest'
import { ValidationEngine } from '../../../src/validation/validator.js'
import type { StepDefinition } from '../../../src/types.js'

interface TestData {
  name: string
  age: number
  email: string
}

describe('ValidationEngine', () => {
  let engine: ValidationEngine<TestData>

  beforeEach(() => {
    engine = new ValidationEngine<TestData>()
  })

  describe('validate', () => {
    it('should return null when no validator provided', () => {
      const data = { name: '', age: 0, email: '' }
      const result = engine.validate(data, undefined)

      expect(result).toBeNull()
    })

    it('should validate using function validator', () => {
      const data = { name: '', age: 0, email: '' }
      const validator = (data: TestData) => {
        if (!data.name) {
          return { name: 'Name is required' }
        }
        return null
      }

      const result = engine.validate(data, validator)

      expect(result).toEqual({ name: 'Name is required' })
    })

    it('should return null when validation passes', () => {
      const data = { name: 'John', age: 30, email: '' }
      const validator = (data: TestData) => {
        if (!data.name) {
          return { name: 'Name is required' }
        }
        return null
      }

      const result = engine.validate(data, validator)

      expect(result).toBeNull()
    })
  })

  describe('validateAsync', () => {
    it('should return null when no async validator provided', async () => {
      const data = { name: '', age: 0, email: '' }
      const result = await engine.validateAsync(data, undefined)

      expect(result).toBeNull()
    })

    it('should validate using async function validator', async () => {
      const data = { name: 'john', age: 30, email: '' }
      const asyncValidator = async (data: TestData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 10))

        if (data.name === 'john') {
          return { name: 'Username already taken' }
        }
        return null
      }

      const result = await engine.validateAsync(data, asyncValidator)

      expect(result).toEqual({ name: 'Username already taken' })
    })

    it('should return null when async validation passes', async () => {
      const data = { name: 'jane', age: 30, email: '' }
      const asyncValidator = async (data: TestData) => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return null
      }

      const result = await engine.validateAsync(data, asyncValidator)

      expect(result).toBeNull()
    })
  })

  describe('validateSchema', () => {
    it('should validate data against schema', () => {
      const data = { name: '', age: 15, email: '' }
      const schema = {
        name: { required: true, minLength: 2 },
        age: { required: true, min: 18 },
      }

      const result = engine.validateSchema(data, schema)

      expect(result).toEqual({
        name: 'Must be at least 2 characters',
        age: 'Must be at least 18',
      })
    })

    it('should return null when schema validation passes', () => {
      const data = { name: 'John', age: 25, email: '' }
      const schema = {
        name: { required: true, minLength: 2 },
        age: { required: true, min: 18 },
      }

      const result = engine.validateSchema(data, schema)

      expect(result).toBeNull()
    })
  })

  describe('validateAll', () => {
    it('should combine schema, function, and async validation', async () => {
      const data = { name: '', age: 15, email: 'invalid' }
      const step: StepDefinition<TestData> = {
        id: 'test',
        title: 'Test',
        schema: {
          name: { required: true },
          age: { min: 18 },
        },
        validate: (data) => {
          if (data.name && data.name.length < 2) {
            return { name: 'Name too short' }
          }
          return null
        },
        validateAsync: async (data) => {
          await new Promise((resolve) => setTimeout(resolve, 10))
          if (data.email && !data.email.includes('@')) {
            return { email: 'Invalid email' }
          }
          return null
        },
      }

      const result = await engine.validateAll(data, step)

      expect(result).toEqual({
        name: 'Field is required',
        age: 'Must be at least 18',
        email: 'Invalid email',
      })
    })

    it('should merge errors from all sources', async () => {
      const data = { name: 'X', age: 15, email: '' }
      const step: StepDefinition<TestData> = {
        id: 'test',
        title: 'Test',
        schema: {
          name: { minLength: 2 },
          age: { min: 18 },
        },
        validate: (data) => ({ name: 'Custom error' }),
        validateAsync: async () => ({ email: 'Async error' }),
      }

      const result = await engine.validateAll(data, step)

      expect(result).toEqual({
        name: 'Custom error',
        age: 'Must be at least 18',
        email: 'Async error',
      })
    })

    it('should return null when all validations pass', async () => {
      const data = { name: 'John', age: 25, email: 'test@example.com' }
      const step: StepDefinition<TestData> = {
        id: 'test',
        title: 'Test',
        schema: {
          name: { required: true },
          age: { min: 18 },
        },
        validate: () => null,
        validateAsync: async () => null,
      }

      const result = await engine.validateAll(data, step)

      expect(result).toBeNull()
    })
  })

  describe('isValid', () => {
    it('should return true when no schema provided', () => {
      const data = { name: '', age: 0, email: '' }
      const result = engine.isValid(data)

      expect(result).toBe(true)
    })

    it('should return true when validation passes', () => {
      const data = { name: 'John', age: 25, email: '' }
      const schema = { name: { required: true } }

      const result = engine.isValid(data, schema)

      expect(result).toBe(true)
    })

    it('should return false when validation fails', () => {
      const data = { name: '', age: 25, email: '' }
      const schema = { name: { required: true } }

      const result = engine.isValid(data, schema)

      expect(result).toBe(false)
    })
  })

  describe('validateFields', () => {
    it('should validate specific fields', () => {
      const data = { name: '', age: 15, email: '' }
      const schema = {
        name: { required: true },
        age: { min: 18 },
        email: { required: true },
      }

      const result = engine.validateFields(data, ['name', 'age'], schema)

      expect(result.get('name')).toBe('Field is required')
      expect(result.get('age')).toBe('Must be at least 18')
      expect(result.has('email')).toBe(false)
    })

    it('should return empty map when all fields pass', () => {
      const data = { name: 'John', age: 25, email: '' }
      const schema = {
        name: { required: true },
        age: { min: 18 },
      }

      const result = engine.validateFields(data, ['name', 'age'], schema)

      expect(result.size).toBe(0)
    })
  })

  describe('getFirstError', () => {
    it('should return first error for field', () => {
      const errors = { name: 'Name is required', age: 'Too young' }

      const result = engine.getFirstError(errors, 'name')

      expect(result).toBe('Name is required')
    })

    it('should return undefined for field with no errors', () => {
      const errors = { name: 'Name is required', age: 'Too young' }

      const result = engine.getFirstError(errors, 'email')

      expect(result).toBeUndefined()
    })

    it('should return undefined when errors is null', () => {
      const result = engine.getFirstError(null, 'name')

      expect(result).toBeUndefined()
    })
  })

  describe('getErrorMessages', () => {
    it('should return array of error messages', () => {
      const errors = { name: 'Name is required', age: 'Too young' }

      const result = engine.getErrorMessages(errors)

      expect(result).toEqual(['Name is required', 'Too young'])
    })

    it('should return empty array when no errors', () => {
      const result = engine.getErrorMessages(null)

      expect(result).toEqual([])
    })
  })

  describe('hasErrors', () => {
    it('should return true when there are errors', () => {
      const errors = { name: 'Name is required' }

      const result = engine.hasErrors(errors)

      expect(result).toBe(true)
    })

    it('should return false when errors is null', () => {
      const result = engine.hasErrors(null)

      expect(result).toBe(false)
    })

    it('should return false when errors is empty', () => {
      const result = engine.hasErrors({})

      expect(result).toBe(false)
    })
  })
})
