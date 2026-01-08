import { describe, it, expect, beforeEach } from 'vitest'
import { MiddlewareManager } from '../../../src/core/middleware.js'
import type { WizardAction, WizardState } from '../../../src/types.js'

interface TestData {
  name?: string
}

describe('MiddlewareManager', () => {
  let manager: MiddlewareManager<TestData>
  let getState: () => WizardState<TestData>
  let dispatch: (action: WizardAction<TestData>) => void | Promise<void>
  let dispatchedActions: WizardAction<TestData>[]

  beforeEach(() => {
    manager = new MiddlewareManager<TestData>()
    dispatchedActions = []

    getState = () =>
      ({
        currentStep: {
          id: 'step1',
          index: 0,
          title: 'Step 1',
          isActive: true,
          isCompleted: false,
          isCurrent: true,
          isUpcoming: false,
          isDisabled: false,
          canSkip: false,
          hasError: false,
          errors: {},
        },
        currentIndex: 0,
        steps: [],
        activeSteps: [],
        visibleSteps: [],
        data: {} as TestData,
        errors: {},
        history: [],
        isFirst: true,
        isLast: false,
        isComplete: false,
        canGoNext: false,
        canGoPrev: false,
        progress: 0,
        progressPercent: 0,
        completedSteps: 0,
        totalSteps: 1,
        isLoading: false,
        isValidating: false,
      }) as WizardState<TestData>

    dispatch = (action: WizardAction<TestData>) => {
      dispatchedActions.push(action)
    }
  })

  describe('use', () => {
    it('should add middleware to chain', () => {
      const middleware = vi.fn()

      manager.use(middleware)

      expect(manager.size).toBe(1)
    })

    it('should return unsubscribe function', () => {
      const middleware = vi.fn()

      const unsub = manager.use(middleware)

      expect(typeof unsub).toBe('function')
    })

    it('should unsubscribe middleware', () => {
      const middleware = vi.fn()

      const unsub = manager.use(middleware)
      expect(manager.size).toBe(1)

      unsub()
      expect(manager.size).toBe(0)
    })
  })

  describe('execute', () => {
    it('should execute middleware in order', async () => {
      const calls: string[] = []

      manager.use((action, next) => {
        calls.push('mw1-before')
        return next(action)
      })

      manager.use((action, next) => {
        calls.push('mw2-before')
        return next(action)
      })

      const action: WizardAction<TestData> = { type: 'NEXT' }
      await manager.execute(action, getState, dispatch)

      expect(calls).toEqual(['mw1-before', 'mw2-before'])
    })

    it('should call dispatch after all middleware', async () => {
      const middleware = vi.fn((action, next) => next(action))

      manager.use(middleware)

      const action: WizardAction<TestData> = { type: 'NEXT' }
      await manager.execute(action, getState, dispatch)

      expect(dispatchedActions).toHaveLength(1)
      expect(dispatchedActions[0]).toEqual(action)
    })

    it('should pass action to middleware', async () => {
      const middleware = vi.fn((action, next) => next(action))

      manager.use(middleware)

      const action: WizardAction<TestData> = { type: 'SET_DATA', data: { name: 'John' } }
      await manager.execute(action, getState, dispatch)

      expect(middleware).toHaveBeenCalledWith(
        action,
        expect.any(Function),
        getState
      )
    })

    it('should pass getState to middleware', async () => {
      const middleware = vi.fn((action, next, getState) => {
        getState()
        return next(action)
      })

      manager.use(middleware)

      const action: WizardAction<TestData> = { type: 'NEXT' }
      await manager.execute(action, getState, dispatch)

      expect(middleware).toHaveBeenCalledWith(
        action,
        expect.any(Function),
        getState
      )
    })

    it('should support async middleware', async () => {
      let order: string[] = []

      manager.use(async (action, next) => {
        order.push('mw1-start')
        await new Promise((resolve) => setTimeout(resolve, 10))
        order.push('mw1-end')
        return next(action)
      })

      const action: WizardAction<TestData> = { type: 'NEXT' }
      await manager.execute(action, getState, dispatch)

      expect(order).toEqual(['mw1-start', 'mw1-end'])
    })

    it('should allow middleware to block action', async () => {
      manager.use(async (action, next) => {
        // Don't call next - block the action
      })

      const action: WizardAction<TestData> = { type: 'NEXT' }
      await manager.execute(action, getState, dispatch)

      expect(dispatchedActions).toHaveLength(0)
    })

    it('should allow middleware to modify action', async () => {
      manager.use((action, next) => {
        // Modify action
        const modified = { ...action, type: 'PREV' as const }
        return next(modified)
      })

      const action: WizardAction<TestData> = { type: 'NEXT' }
      await manager.execute(action, getState, dispatch)

      expect(dispatchedActions[0].type).toBe('PREV')
    })
  })

  describe('clear', () => {
    it('should clear all middleware', () => {
      manager.use(vi.fn())
      manager.use(vi.fn())

      expect(manager.size).toBe(2)

      manager.clear()

      expect(manager.size).toBe(0)
    })
  })

  describe('size', () => {
    it('should return number of middleware', () => {
      expect(manager.size).toBe(0)

      manager.use(vi.fn())
      expect(manager.size).toBe(1)

      manager.use(vi.fn())
      expect(manager.size).toBe(2)
    })
  })
})
