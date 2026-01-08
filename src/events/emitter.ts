import type { WizardEventMap } from '../types.js'

/**
 * Type-safe event emitter
 */
export class EventEmitter<E extends Record<string, any>> {
  private listeners: Map<keyof E, Set<Function>> = new Map()

  /**
   * Subscribe to an event
   * @param event - Event name
   * @param handler - Event handler
   * @returns Unsubscribe function
   */
  on<K extends keyof E>(
    event: K,
    handler: (payload: E[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)
    return () => this.off(event, handler)
  }

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param handler - Event handler to remove
   */
  off<K extends keyof E>(event: K, handler: (payload: E[K]) => void): void {
    this.listeners.get(event)?.delete(handler)
  }

  /**
   * Emit an event
   * @param event - Event name
   * @param payload - Event payload
   */
  emit<K extends keyof E>(event: K, payload: E[K]): void {
    this.listeners.get(event)?.forEach((handler) => {
      try {
        handler(payload)
      } catch (error) {
        // Don't let one handler break others
        console.error(`Error in event handler for "${String(event)}":`, error)
      }
    })
  }

  /**
   * Subscribe to an event once
   * @param event - Event name
   * @param handler - Event handler
   */
  once<K extends keyof E>(
    event: K,
    handler: (payload: E[K]) => void
  ): void {
    const wrapped = (payload: E[K]) => {
      handler(payload)
      this.off(event, wrapped as (payload: E[K]) => void)
    }
    this.on(event, wrapped as (payload: E[K]) => void)
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.listeners.clear()
  }

  /**
   * Get the number of listeners for an event
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount<K extends keyof E>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }

  /**
   * Check if there are any listeners for an event
   * @param event - Event name
   * @returns True if there are listeners
   */
  hasListeners<K extends keyof E>(event: K): boolean {
    return (this.listeners.get(event)?.size ?? 0) > 0
  }
}

/**
 * Create a typed event emitter
 * @returns New EventEmitter instance
 */
export function createEventEmitter<
  E extends Record<string, any> = WizardEventMap
>(): EventEmitter<E> {
  return new EventEmitter<E>()
}
