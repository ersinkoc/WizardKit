import { describe, it, expect } from 'vitest'
import { createWizard } from '../../../src/core/factory.js'
import type { WizardConfig, StepDefinition } from '../../../src/types.js'

interface TestData {
  name?: string
  email?: string
}

describe('createWizard', () => {
  it('should create a wizard instance', () => {
    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
    }

    const wizard = createWizard<TestData>(config)

    expect(wizard).toBeDefined()
    expect(wizard.getState).toBeDefined()
    expect(wizard.next).toBeDefined()
    expect(wizard.prev).toBeDefined()
  })

  it('should use provided initial data', () => {
    const config: WizardConfig<TestData> = {
      steps: [{ id: 'step1', title: 'Step 1' }],
      initialData: { name: 'John', email: 'john@example.com' },
    }

    const wizard = createWizard<TestData>(config)

    expect(wizard.data).toEqual({ name: 'John', email: 'john@example.com' })
  })

  it('should start at first step by default', () => {
    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
    }

    const wizard = createWizard<TestData>(config)

    expect(wizard.currentStep.id).toBe('step1')
    expect(wizard.currentIndex).toBe(0)
  })

  it('should support initial step by ID', () => {
    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
      initialStep: 'step2',
    }

    const wizard = createWizard<TestData>(config)

    expect(wizard.currentStep.id).toBe('step2')
  })

  it('should support initial step by index', () => {
    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ],
      initialStep: 1,
    }

    const wizard = createWizard<TestData>(config)

    expect(wizard.currentStep.id).toBe('step2')
  })

  it('should respect linear mode', () => {
    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
      linear: true,
    }

    const wizard = createWizard<TestData>(config)

    // Linear mode should prevent jumping ahead
    wizard.goTo('step2').then((canGo) => {
      // In linear mode, should not be able to jump to step 2
      expect(canGo).toBe(false)
    })
  })

  it('should restore from persistence if configured', () => {
    // Mock localStorage
    const mockStorage = {
      'test-wizard': JSON.stringify({
        data: { name: 'Restored', email: 'restored@example.com' },
        currentStep: 'step2',
        history: ['step1'],
      }),
    }

    global.localStorage = {
      getItem: (key) => mockStorage[key as keyof typeof mockStorage] || null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      get length() {
        return Object.keys(mockStorage).length
      },
      key: () => null,
    }

    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
      ],
      persistKey: 'test-wizard',
      persistStorage: 'local',
    }

    const wizard = createWizard<TestData>(config)

    // Should restore data
    expect(wizard.data.name).toBe('Restored')
  })
})
