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

  it('should respect linear mode', async () => {
    const config: WizardConfig<TestData> = {
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ],
      linear: true,
    }

    const wizard = createWizard<TestData>(config)

    // In linear mode, should not be able to jump directly to step3
    const canGoToStep3 = await wizard.goTo('step3')
    expect(canGoToStep3).toBe(false)

    // But should be able to go to the next step (step2)
    const canGoToStep2 = await wizard.goTo('step2')
    expect(canGoToStep2).toBe(true)
  })

  it('should restore from persistence if configured', async () => {
    // Mock localStorage
    const mockStorage = {
      'test-wizard': JSON.stringify({
        data: { name: 'Restored', email: 'restored@example.com' },
        currentStep: 'step2',
        history: ['step1'],
      }),
    }

    // Mock both global and window localStorage
    const mockLocalStorage = {
      getItem: (key) => mockStorage[key as keyof typeof mockStorage] || null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      get length() {
        return Object.keys(mockStorage).length
      },
      key: () => null,
    }

    global.localStorage = mockLocalStorage as any
    ;(global as any).window = {
      localStorage: mockLocalStorage,
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

    // Wait for async restoration to complete
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Should restore data
    expect(wizard.data.name).toBe('Restored')
  })
})
