import type { PersistStorage } from '../types.js'

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * localStorage adapter
 * Falls back to memory storage in non-browser environments
 */
export const localStorageAdapter: PersistStorage = {
  get(key: string): string | null {
    if (!isBrowser()) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },

  set(key: string, value: string): void {
    if (!isBrowser()) return
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Silently fail if localStorage is not available
    }
  },
}

/**
 * sessionStorage adapter
 * Falls back to memory storage in non-browser environments
 */
export const sessionStorageAdapter: PersistStorage = {
  get(key: string): string | null {
    if (!isBrowser()) return null
    try {
      return window.sessionStorage.getItem(key)
    } catch {
      return null
    }
  },

  set(key: string, value: string): void {
    if (!isBrowser()) return
    try {
      window.sessionStorage.setItem(key, value)
    } catch {
      // Silently fail if sessionStorage is not available
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return
    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // Silently fail if sessionStorage is not available
    }
  },
}

/**
 * Create an in-memory storage adapter
 * Useful for SSR or testing
 * @returns In-memory storage adapter
 */
export function createMemoryStorage(): PersistStorage {
  const store = new Map<string, string>()

  return {
    get(key: string): string | null {
      return store.get(key) ?? null
    },

    set(key: string, value: string): void {
      store.set(key, value)
    },

    remove(key: string): void {
      store.delete(key)
    },
  }
}

/**
 * Create a storage adapter from a storage type string
 * @param type - Storage type ('local', 'session', or 'memory')
 * @returns Storage adapter
 */
export function createStorage(
  type: 'local' | 'session' | 'memory'
): PersistStorage {
  switch (type) {
    case 'local':
      return localStorageAdapter
    case 'session':
      return sessionStorageAdapter
    case 'memory':
      return createMemoryStorage()
    default:
      return createMemoryStorage()
  }
}
