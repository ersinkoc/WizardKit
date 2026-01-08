import { describe, it, expect, beforeEach } from 'vitest'
import { StepManager } from '../../../src/core/step.js'
import type { StepDefinition } from '../../../src/types.js'

interface TestData {
  accountType?: 'individual' | 'corporate'
  name?: string
  companyName?: string
}

describe('StepManager', () => {
  let definitions: StepDefinition<TestData>[]
  let initialData: TestData
  let manager: StepManager<TestData>

  beforeEach(() => {
    definitions = [
      { id: 'step1', title: 'Step 1' },
      { id: 'step2', title: 'Step 2' },
      {
        id: 'premium',
        title: 'Premium Features',
        condition: (data) => data.accountType === 'premium',
      },
      { id: 'step3', title: 'Step 3' },
    ]
    initialData = {}
    manager = new StepManager<TestData>(definitions, initialData)
  })

  describe('constructor', () => {
    it('should create instance with definitions and data', () => {
      expect(manager).toBeDefined()
      expect(manager.getDefinitions()).toEqual(definitions)
    })
  })

  describe('getSteps', () => {
    it('should return all steps with computed properties', () => {
      const steps = manager.getSteps()

      expect(steps).toHaveLength(4)
      expect(steps[0]).toHaveProperty('id', 'step1')
      expect(steps[0]).toHaveProperty('index', 0)
      expect(steps[0]).toHaveProperty('isActive', true)
      expect(steps[0]).toHaveProperty('isCompleted', false)
      expect(steps[0]).toHaveProperty('isCurrent', false)
      expect(steps[0]).toHaveProperty('isUpcoming', false)
      expect(steps[0]).toHaveProperty('isDisabled', false)
      expect(steps[0]).toHaveProperty('canSkip', false)
      expect(steps[0]).toHaveProperty('hasError', false)
    })

    it('should compute isActive based on conditions', () => {
      const steps = manager.getSteps()

      const premiumStep = steps.find((s) => s.id === 'premium')
      expect(premiumStep?.isActive).toBe(false)
    })

    it('should compute isUpcoming for inactive steps', () => {
      const steps = manager.getSteps()

      const premiumStep = steps.find((s) => s.id === 'premium')
      expect(premiumStep?.isUpcoming).toBe(true)
    })
  })

  describe('getActiveSteps', () => {
    it('should return only active steps', () => {
      const activeSteps = manager.getActiveSteps()

      expect(activeSteps).toHaveLength(3)
      expect(activeSteps.every((s) => s.isActive)).toBe(true)
      expect(activeSteps.find((s) => s.id === 'premium')).toBeUndefined()
    })

    it('should update when data changes', () => {
      manager.updateData({ accountType: 'premium' })

      const activeSteps = manager.getActiveSteps()

      expect(activeSteps).toHaveLength(4)
      expect(activeSteps.find((s) => s.id === 'premium')).toBeDefined()
    })
  })

  describe('findById', () => {
    it('should find step by ID', () => {
      const step = manager.findById('step1')

      expect(step).toBeDefined()
      expect(step?.id).toBe('step1')
    })

    it('should return undefined for non-existent ID', () => {
      const step = manager.findById('non-existent')

      expect(step).toBeUndefined()
    })
  })

  describe('findByIndex', () => {
    it('should find step by index', () => {
      const step = manager.findByIndex(1)

      expect(step).toBeDefined()
      expect(step?.id).toBe('step2')
    })

    it('should return undefined for out of range index', () => {
      const step = manager.findByIndex(10)

      expect(step).toBeUndefined()
    })
  })

  describe('updateData', () => {
    it('should update data reference', () => {
      manager.updateData({ accountType: 'premium' })

      expect(manager.getData()).toEqual({ accountType: 'premium' })
    })

    it('should recompute step conditions after data update', () => {
      expect(manager.getActiveSteps()).toHaveLength(3)

      manager.updateData({ accountType: 'premium' })

      expect(manager.getActiveSteps()).toHaveLength(4)
    })
  })

  describe('setErrors', () => {
    it('should set errors for a step', () => {
      manager.setErrors('step1', { name: 'Name is required' })

      const step = manager.findById('step1')
      expect(step?.errors).toEqual({ name: 'Name is required' })
      expect(step?.hasError).toBe(true)
    })

    it('should clear errors when empty object provided', () => {
      manager.setErrors('step1', { name: 'Error' })
      manager.setErrors('step1', {})

      const step = manager.findById('step1')
      expect(step?.errors).toEqual({})
      expect(step?.hasError).toBe(false)
    })
  })

  describe('clearErrors', () => {
    it('should clear errors for a specific step', () => {
      manager.setErrors('step1', { name: 'Error' })
      manager.clearErrors('step1')

      const step = manager.findById('step1')
      expect(step?.errors).toEqual({})
    })

    it('should clear all errors when no step ID provided', () => {
      manager.setErrors('step1', { name: 'Error' })
      manager.setErrors('step2', { age: 'Error' })
      manager.clearErrors()

      expect(manager.findById('step1')?.errors).toEqual({})
      expect(manager.findById('step2')?.errors).toEqual({})
    })
  })

  describe('getDefinition', () => {
    it('should get step definition by ID', () => {
      const def = manager.getDefinition('step1')

      expect(def).toEqual(definitions[0])
    })

    it('should return undefined for non-existent ID', () => {
      const def = manager.getDefinition('non-existent')

      expect(def).toBeUndefined()
    })
  })

  describe('getData', () => {
    it('should return current data', () => {
      const data = manager.getData()

      expect(data).toEqual(initialData)
    })
  })

  describe('conditions with multiple conditions (AND logic)', () => {
    beforeEach(() => {
      definitions = [
        {
          id: 'conditional',
          title: 'Conditional',
          conditions: [
            (data) => data.accountType === 'corporate',
            (data) => data.name === 'test',
          ],
        },
      ]
      manager = new StepManager<TestData>(definitions, {})
    })

    it('should require all conditions to pass', () => {
      let steps = manager.getSteps()
      expect(steps[0].isActive).toBe(false)

      manager.updateData({ accountType: 'corporate' })
      steps = manager.getSteps()
      expect(steps[0].isActive).toBe(false)

      manager.updateData({ accountType: 'corporate', name: 'test' })
      steps = manager.getSteps()
      expect(steps[0].isActive).toBe(true)
    })
  })

  describe('disabled property', () => {
    beforeEach(() => {
      definitions = [
        { id: 'disabled', title: 'Disabled', disabled: true },
        {
          id: 'dynamic-disabled',
          title: 'Dynamic Disabled',
          disabled: (data) => data.accountType === 'individual',
        },
      ]
      manager = new StepManager<TestData>(definitions, {})
    })

    it('should compute isDisabled from boolean', () => {
      const steps = manager.getSteps()
      expect(steps[0].isDisabled).toBe(true)
    })

    it('should compute isDisabled from function', () => {
      let steps = manager.getSteps()
      expect(steps[1].isDisabled).toBe(false)

      manager.updateData({ accountType: 'individual' })
      steps = manager.getSteps()
      expect(steps[1].isDisabled).toBe(true)
    })
  })

  describe('canSkip property', () => {
    beforeEach(() => {
      definitions = [
        { id: 'skippable', title: 'Skippable', canSkip: true },
        {
          id: 'dynamic-skip',
          title: 'Dynamic Skip',
          canSkip: (data) => data.accountType === 'corporate',
        },
      ]
      manager = new StepManager<TestData>(definitions, {})
    })

    it('should compute canSkip from boolean', () => {
      const steps = manager.getSteps()
      expect(steps[0].canSkip).toBe(true)
    })

    it('should compute canSkip from function', () => {
      let steps = manager.getSteps()
      expect(steps[1].canSkip).toBe(false)

      manager.updateData({ accountType: 'corporate' })
      steps = manager.getSteps()
      expect(steps[1].canSkip).toBe(true)
    })
  })
})
