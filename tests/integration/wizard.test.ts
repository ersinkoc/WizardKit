import { describe, it, expect, beforeEach } from 'vitest'
import { createWizard } from '../../src/core/factory.js'
import type { WizardConfig, StepDefinition } from '../../src/types.js'

interface TestData {
  accountType?: 'individual' | 'corporate'
  name?: string
  companyName?: string
  email?: string
}

describe('Wizard - Integration Tests', () => {
  describe('Basic Navigation', () => {
    let wizard: ReturnType<typeof createWizard<TestData>>

    beforeEach(() => {
      const config: WizardConfig<TestData> = {
        steps: [
          { id: 'step1', title: 'Step 1' },
          { id: 'step2', title: 'Step 2' },
          { id: 'step3', title: 'Step 3' },
        ],
      }

      wizard = createWizard<TestData>(config)
    })

    it('should navigate through all steps', async () => {
      expect(wizard.currentStep.id).toBe('step1')

      await wizard.next()
      expect(wizard.currentStep.id).toBe('step2')

      await wizard.next()
      expect(wizard.currentStep.id).toBe('step3')
    })

    it('should navigate backwards', async () => {
      await wizard.next()
      await wizard.next()
      expect(wizard.currentStep.id).toBe('step3')

      await wizard.prev()
      expect(wizard.currentStep.id).toBe('step2')

      await wizard.prev()
      expect(wizard.currentStep.id).toBe('step1')
    })

    it('should not navigate before first step', async () => {
      const result = await wizard.prev()

      expect(result).toBe(false)
      expect(wizard.currentStep.id).toBe('step1')
    })

    it('should jump to specific step', async () => {
      const result = await wizard.goTo('step3')

      expect(result).toBe(true)
      expect(wizard.currentStep.id).toBe('step3')
    })

    it('should jump to step by index', async () => {
      const result = await wizard.goToIndex(2)

      expect(result).toBe(true)
      expect(wizard.currentStep.id).toBe('step3')
    })

    it('should go to first step', async () => {
      await wizard.next()
      await wizard.next()

      await wizard.first()

      expect(wizard.currentStep.id).toBe('step1')
    })

    it('should go to last step', async () => {
      await wizard.last()

      expect(wizard.currentStep.id).toBe('step3')
    })

    it('should reset to initial state', async () => {
      await wizard.next()
      await wizard.setData({ name: 'John' })

      wizard.reset()

      expect(wizard.currentStep.id).toBe('step1')
      expect(wizard.data.name).toBeUndefined()
    })
  })

  describe('Conditional Steps', () => {
    it('should show/hide steps based on conditions', () => {
      const config: WizardConfig<TestData> = {
        steps: [
          {
            id: 'type',
            title: 'Account Type',
          },
          {
            id: 'individual-info',
            title: 'Individual Info',
            condition: (data) => data.accountType === 'individual',
          },
          {
            id: 'corporate-info',
            title: 'Corporate Info',
            condition: (data) => data.accountType === 'corporate',
          },
          {
            id: 'confirm',
            title: 'Confirm',
          },
        ],
      }

      const wizard = createWizard<TestData>(config)

      // Initially, all but type and confirm should be hidden
      expect(wizard.activeSteps).toHaveLength(2)

      // Set account type to individual
      wizard.setData({ accountType: 'individual' })

      expect(wizard.activeSteps).toHaveLength(3)
      expect(wizard.activeSteps.find((s) => s.id === 'individual-info')).toBeDefined()

      // Change to corporate
      wizard.setData({ accountType: 'corporate' })

      expect(wizard.activeSteps).toHaveLength(3)
      expect(wizard.activeSteps.find((s) => s.id === 'corporate-info')).toBeDefined()
    })

    it('should recompute active steps on data change', () => {
      const config: WizardConfig<TestData> = {
        steps: [
          { id: 'step1', title: 'Step 1' },
          {
            id: 'conditional',
            title: 'Conditional',
            condition: (data) => data.name === 'show',
          },
          { id: 'step2', title: 'Step 2' },
        ],
      }

      const wizard = createWizard<TestData>(config)

      expect(wizard.activeSteps).toHaveLength(2)

      wizard.setData({ name: 'show' })

      expect(wizard.activeSteps).toHaveLength(3)
    })
  })

  describe('Data Management', () => {
    let wizard: ReturnType<typeof createWizard<TestData>>

    beforeEach(() => {
      const config: WizardConfig<TestData> = {
        steps: [{ id: 'step1', title: 'Step 1' }],
      }

      wizard = createWizard<TestData>(config)
    })

    it('should get all data', () => {
      wizard.setData({ name: 'John', email: 'john@example.com' })

      const data = wizard.getData()

      expect(data).toEqual({ name: 'John', email: 'john@example.com' })
    })

    it('should get single field', () => {
      wizard.setData({ name: 'John', email: 'john@example.com' })

      const name = wizard.getData('name')

      expect(name).toBe('John')
    })

    it('should get multiple fields', () => {
      wizard.setData({ name: 'John', email: 'john@example.com', accountType: 'individual' })

      const selected = wizard.getData(['name', 'email'])

      expect(selected).toEqual({ name: 'John', email: 'john@example.com' })
    })

    it('should set data', () => {
      wizard.setData({ name: 'John' })

      expect(wizard.data.name).toBe('John')
    })

    it('should merge data by default', () => {
      wizard.setData({ name: 'John' })
      wizard.setData({ email: 'john@example.com' })

      expect(wizard.data.name).toBe('John')
      expect(wizard.data.email).toBe('john@example.com')
    })

    it('should replace data when replace flag is true', () => {
      wizard.setData({ name: 'John' })
      wizard.setData({ email: 'john@example.com' }, true)

      expect(wizard.data.name).toBeUndefined()
      expect(wizard.data.email).toBe('john@example.com')
    })

    it('should set single field', () => {
      wizard.setField('name' as never, 'John')

      expect(wizard.data.name).toBe('John')
    })

    it('should clear field', () => {
      wizard.setData({ name: 'John' })
      wizard.clearField('name' as never)

      expect(wizard.data.name).toBeUndefined()
    })

    it('should reset data', () => {
      wizard.setData({ name: 'John' })
      wizard.resetData()

      expect(wizard.data.name).toBeUndefined()
    })
  })

  describe('Validation', () => {
    it('should validate current step', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            validate: (data) => {
              if (!data.name) {
                return { name: 'Name is required' }
              }
              return null
            },
          },
        ],
      }

      const wizard = createWizard<TestData>(config)

      const errors = await wizard.validate()

      expect(errors).toEqual({ name: 'Name is required' })
    })

    it('should validate and block navigation on next', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            validate: (data) => {
              if (!data.name) {
                return { name: 'Name is required' }
              }
              return null
            },
          },
          { id: 'step2', title: 'Step 2' },
        ],
      }

      const wizard = createWizard<TestData>(config)

      const canProceed = await wizard.next()

      expect(canProceed).toBe(false)
      expect(wizard.currentStep.id).toBe('step1')
    })

    it('should allow navigation after validation passes', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            validate: (data) => {
              if (!data.name) {
                return { name: 'Name is required' }
              }
              return null
            },
          },
          { id: 'step2', title: 'Step 2' },
        ],
      }

      const wizard = createWizard<TestData>(config)

      // First try should fail
      await wizard.next()
      expect(wizard.currentStep.id).toBe('step1')

      // Set required data
      wizard.setData({ name: 'John' })

      // Now should succeed
      await wizard.next()
      expect(wizard.currentStep.id).toBe('step2')
    })

    it('should check validity', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            validate: (data) => (!data.name ? { name: 'Required' } : null),
          },
        ],
      }

      const wizard = createWizard<TestData>(config)

      expect(await wizard.isValid()).toBe(false)

      wizard.setData({ name: 'John' })

      expect(await wizard.isValid()).toBe(true)
    })
  })

  describe('Branching', () => {
    it('should follow branches based on data', async () => {
      const config: WizardConfig<TestData> = {
        linear: false,
        steps: [
          { id: 'type', title: 'Type' },
          {
            id: 'payment-method',
            title: 'Payment Method',
            branches: {
              card: {
                condition: (data) => data.accountType === 'individual',
                nextStep: 'card-payment',
              },
              transfer: {
                condition: (data) => data.accountType === 'corporate',
                nextStep: 'transfer-payment',
              },
            },
          },
          { id: 'card-payment', title: 'Card Payment' },
          { id: 'transfer-payment', title: 'Transfer Payment' },
          { id: 'confirm', title: 'Confirm' },
        ],
      }

      const wizard = createWizard<TestData>(config)

      // Navigate to payment method step
      await wizard.next()

      // Set account type and navigate
      wizard.setData({ accountType: 'individual' })
      await wizard.next()

      expect(wizard.currentStep.id).toBe('card-payment')

      // Reset and try corporate
      wizard.reset()
      await wizard.next()
      wizard.setData({ accountType: 'corporate' })
      await wizard.next()

      expect(wizard.currentStep.id).toBe('transfer-payment')
    })
  })

  describe('Events', () => {
    it('should emit step:change event', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          { id: 'step1', title: 'Step 1' },
          { id: 'step2', title: 'Step 2' },
        ],
      }

      const wizard = createWizard<TestData>(config)
      const handler = vi.fn()

      wizard.on('step:change', handler)

      await wizard.next()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          step: expect.objectContaining({ id: 'step2' }),
          direction: 'next',
        })
      )
    })

    it('should emit data:change event', () => {
      const config: WizardConfig<TestData> = {
        steps: [{ id: 'step1', title: 'Step 1' }],
      }

      const wizard = createWizard<TestData>(config)
      const handler = vi.fn()

      wizard.on('data:change', handler)

      wizard.setData({ name: 'John' })

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          changedFields: ['name'],
        })
      )
    })

    it('should emit validation:error event', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            validate: () => ({ name: 'Required' }),
          },
        ],
      }

      const wizard = createWizard<TestData>(config)
      const handler = vi.fn()

      wizard.on('validation:error', handler)

      await wizard.validate()

      expect(handler).toHaveBeenCalled()
    })

    it('should emit complete event', async () => {
      const config: WizardConfig<TestData> = {
        steps: [{ id: 'step1', title: 'Step 1' }],
        onComplete: vi.fn(),
      }

      const wizard = createWizard<TestData>(config)
      const handler = vi.fn()

      wizard.on('complete', handler)

      await wizard.complete()

      expect(handler).toHaveBeenCalled()
    })

    it('should support unsubscribe', () => {
      const config: WizardConfig<TestData> = {
        steps: [{ id: 'step1', title: 'Step 1' }],
      }

      const wizard = createWizard<TestData>(config)
      const handler = vi.fn()

      const unsub = wizard.on('data:change', handler)
      unsub()

      wizard.setData({ name: 'John' })

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Middleware', () => {
    it('should execute middleware on action dispatch', async () => {
      const config: WizardConfig<TestData> = {
        steps: [
          { id: 'step1', title: 'Step 1' },
          { id: 'step2', title: 'Step 2' },
        ],
      }

      const wizard = createWizard<TestData>(config)
      const middleware = vi.fn((action, next) => next(action))

      wizard.use(middleware)

      await wizard.dispatch({ type: 'NEXT' })

      expect(middleware).toHaveBeenCalled()
    })
  })
})
