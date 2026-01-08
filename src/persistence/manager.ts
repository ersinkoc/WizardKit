import type {
  PersistStorage,
  WizardState,
} from '../types.js'
import { createStorage, createMemoryStorage } from './storage.js'

export interface PersistenceConfig {
  key: string
  storage?: 'local' | 'session' | PersistStorage
  debounce?: number
  fields?: ('data' | 'currentStep' | 'history')[]
}

interface PersistedState {
  data: Record<string, unknown>
  currentStep: string
  history: string[]
}

/**
 * Persistence manager handles saving and restoring wizard state
 */
export class PersistenceManager<TData = Record<string, unknown>> {
  private storage: PersistStorage
  private key: string
  private debounceMs: number
  private fields: ('data' | 'currentStep' | 'history')[]
  private debounceTimer: ReturnType<typeof setTimeout> | null = null

  constructor(config: PersistenceConfig) {
    this.key = config.key
    this.debounceMs = config.debounce ?? 300
    this.fields = config.fields ?? ['data', 'currentStep', 'history']
    this.storage = this.createStorage(config.storage)
  }

  /**
   * Create storage adapter from config
   */
  private createStorage(
    storage?: 'local' | 'session' | PersistStorage
  ): PersistStorage {
    if (!storage) {
      return createMemoryStorage()
    }

    if (typeof storage === 'string') {
      return createStorage(storage)
    }

    return storage
  }

  /**
   * Save state to storage (debounced)
   * @param state - Current wizard state
   */
  save(state: WizardState<TData>): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.saveImmediate(state)
    }, this.debounceMs)
  }

  /**
   * Save state immediately (without debouncing)
   * @param state - Current wizard state
   */
  saveImmediate(state: WizardState<TData>): void {
    const data = this.serialize(state)
    this.storage.set(this.key, data)
  }

  /**
   * Restore state from storage
   * @returns Restored state or null if nothing persisted
   */
  async restore(): Promise<Partial<PersistedState> | null> {
    const data = await this.storage.get(this.key)
    if (!data) return null

    try {
      return this.deserialize(data)
    } catch {
      return null
    }
  }

  /**
   * Clear persisted state
   */
  clear(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    this.storage.remove(this.key)
  }

  /**
   * Serialize state to string
   */
  private serialize(state: WizardState<TData>): string {
    const persisted: Partial<PersistedState> = {}

    if (this.fields.includes('data')) {
      persisted.data = state.data as Record<string, unknown>
    }

    if (this.fields.includes('currentStep')) {
      persisted.currentStep = state.currentStep.id
    }

    if (this.fields.includes('history')) {
      persisted.history = state.history
    }

    return JSON.stringify(persisted)
  }

  /**
   * Deserialize string to state
   */
  private deserialize(data: string): Partial<PersistedState> {
    return JSON.parse(data) as Partial<PersistedState>
  }

  /**
   * Destroy the persistence manager
   */
  destroy(): void {
    this.clear()
  }
}

/**
 * Create a persistence manager
 * @param config - Persistence configuration
 * @returns New PersistenceManager instance
 */
export function createPersistenceManager<
  TData = Record<string, unknown>
>(config: PersistenceConfig): PersistenceManager<TData> {
  return new PersistenceManager<TData>(config)
}
