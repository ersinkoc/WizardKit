import type {
  WizardAction,
  WizardMiddleware,
  WizardState,
} from '../types.js'

/**
 * Middleware manager handles action interception and modification
 */
export class MiddlewareManager<TData = Record<string, unknown>> {
  private middleware: WizardMiddleware<TData>[] = []

  /**
   * Add middleware to the chain
   * @param middleware - Middleware function
   * @returns Unsubscribe function
   */
  use(middleware: WizardMiddleware<TData>): () => void {
    this.middleware.push(middleware)

    // Return unsubscribe function
    return () => {
      const index = this.middleware.indexOf(middleware)
      if (index > -1) {
        this.middleware.splice(index, 1)
      }
    }
  }

  /**
   * Execute middleware chain
   * @param action - Action to process
   * @param getState - Function to get current state
   * @param dispatch - Function to dispatch the action
   */
  async execute(
    action: WizardAction<TData>,
    getState: () => WizardState<TData>,
    dispatch: (action: WizardAction<TData>) => void | Promise<void>
  ): Promise<void> {
    let index = 0

    const next = async (action: WizardAction<TData>): Promise<void> => {
      if (index < this.middleware.length) {
        const mw = this.middleware[index++]
        if (mw) {
          await mw(action, next, getState)
        } else {
          // Fallback to dispatch if middleware is undefined
          await dispatch(action)
        }
      } else {
        // All middleware processed, dispatch the action
        await dispatch(action)
      }
    }

    await next(action)
  }

  /**
   * Clear all middleware
   */
  clear(): void {
    this.middleware = []
  }

  /**
   * Get the number of middleware in the chain
   */
  get size(): number {
    return this.middleware.length
  }
}

/**
 * Create a middleware manager
 * @returns New MiddlewareManager instance
 */
export function createMiddlewareManager<
  TData = Record<string, unknown>
>(): MiddlewareManager<TData> {
  return new MiddlewareManager<TData>()
}
