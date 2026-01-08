import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PersistenceManager } from '../../../src/persistence/manager.js'
import type { WizardState } from '../../../src/types.js'
import { createMemoryStorage } from '../../../src/persistence/storage.js'

interface TestData {
  name: string
  age: number
}

describe('PersistenceManager', () => {
  let manager: PersistenceManager<TestData>
  let mockStorage: Record<string, string>

  beforeEach(() => {
    // Create mock storage
    mockStorage = {}
    const storage = {
      get: async (key: string) => mockStorage[key] || null,
      set: async (key: string, value: string) => {
        mockStorage[key] = value
      },
      remove: async (key: string) => {
        delete mockStorage[key]
      },
    }

    manager = new PersistenceManager<TestData>({
      key: 'test-wizard',
      storage: storage as any,
      debounce: 10,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with config', () => {
      expect(manager).toBeDefined()
    })

    it('should use default debounce when not provided', () => {
      const defaultManager = new PersistenceManager<TestData>({
        key: 'test',
        storage: createMemoryStorage(),
      })

      expect(defaultManager).toBeDefined()
    })
  })

  describe('save', () => {
    it('should save state with debouncing', async () => {
      const state: Partial<WizardState<TestData>> = {
        data: { name: 'John', age: 30 } as TestData,
        currentStep: { id: 'step1', index: 0, title: 'Step 1', isActive: true, isCompleted: false, isCurrent: false, isUpcoming: false, isDisabled: false, canSkip: false, hasError: false, errors: {} },
        history: ['step1'],
      }

      manager.save(state as WizardState<TestData>)

      // Should not save immediately
      expect(mockStorage['test-wizard']).toBeUndefined()

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 20))

      expect(mockStorage['test-wizard']).toBeDefined()
    })

    it('should reset debounce timer on multiple calls', async () => {
      const state: Partial<WizardState<TestData>> = {
        data: { name: 'John', age: 30 } as TestData,
        currentStep: { id: 'step1', index: 0, title: 'Step 1', isActive: true, isCompleted: false, isCurrent: false, isUpcoming: false, isDisabled: false, canSkip: false, hasError: false, errors: {} },
        history: [],
      }

      manager.save(state as WizardState<TestData>)

      // Call again before debounce completes
      await new Promise((resolve) => setTimeout(resolve, 5))
      manager.save(state as WizardState<TestData>)

      // Wait longer than debounce
      await new Promise((resolve) => setTimeout(resolve, 25))

      expect(mockStorage['test-wizard']).toBeDefined()
    })

    it('should save specified fields only', async () => {
      const fieldManager = new PersistenceManager<TestData>({
        key: 'test',
        storage: {
          get: async (key: string) => mockStorage[key] || null,
          set: async (key: string, value: string) => {
            mockStorage[key] = value
          },
          remove: async (key: string) => {
            delete mockStorage[key]
          },
        } as any,
        fields: ['data', 'currentStep'],
      })

      const state: Partial<WizardState<TestData>> = {
        data: { name: 'John', age: 30 } as TestData,
        currentStep: { id: 'step1', index: 0, title: 'Step 1', isActive: true, isCompleted: false, isCurrent: false, isUpcoming: false, isDisabled: false, canSkip: false, hasError: false, errors: {} },
        history: ['step1'],
      }

      fieldManager.save(state as WizardState<TestData>)

      await new Promise((resolve) => setTimeout(resolve, 20))

      const saved = JSON.parse(mockStorage['test']!)
      expect(saved.data).toBeDefined()
      expect(saved.currentStep).toBeDefined()
      expect(saved.history).toBeUndefined()
    })
  })

  describe('saveImmediate', () => {
    it('should save state immediately', () => {
      const state: Partial<WizardState<TestData>> = {
        data: { name: 'John', age: 30 } as TestData,
        currentStep: { id: 'step1', index: 0, title: 'Step 1', isActive: true, isCompleted: false, isCurrent: false, isUpcoming: false, isDisabled: false, canSkip: false, hasError: false, errors: {} },
        history: [],
      }

      manager.saveImmediate(state as WizardState<TestData>)

      expect(mockStorage['test-wizard']).toBeDefined()
    })
  })

  describe('restore', () => {
    it('should restore saved state', async () => {
      const savedData = {
        data: { name: 'John', age: 30 },
        currentStep: 'step1',
        history: ['step1'],
      }

      mockStorage['test-wizard'] = JSON.stringify(savedData)

      const restored = await manager.restore()

      expect(restored).toEqual(savedData)
    })

    it('should return null when no data exists', async () => {
      const restored = await manager.restore()

      expect(restored).toBeNull()
    })

    it('should handle invalid JSON gracefully', async () => {
      mockStorage['test-wizard'] = 'invalid-json'

      const restored = await manager.restore()

      expect(restored).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear persisted data', () => {
      mockStorage['test-wizard'] = JSON.stringify({ data: { name: 'John' } })

      manager.clear()

      expect(mockStorage['test-wizard']).toBeUndefined()
    })

    it('should cancel pending saves', async () => {
      const state: Partial<WizardState<TestData>> = {
        data: { name: 'John', age: 30 } as TestData,
        currentStep: { id: 'step1', index: 0, title: 'Step 1', isActive: true, isCompleted: false, isCurrent: false, isUpcoming: false, isDisabled: false, canSkip: false, hasError: false, errors: {} },
        history: [],
      }

      manager.save(state as WizardState<TestData>)
      manager.clear()

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 20))

      expect(mockStorage['test-wizard']).toBeUndefined()
    })
  })
})
