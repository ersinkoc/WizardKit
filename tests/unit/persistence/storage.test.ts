import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  localStorageAdapter,
  sessionStorageAdapter,
  createMemoryStorage,
  createStorage,
} from '../../../src/persistence/storage.js'

describe('localStorage adapter', () => {
  let mockLocalStorage: Record<string, string>

  beforeEach(() => {
    mockLocalStorage = {}

    // Define the mock localStorage object
    const mockStorage = {
      getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key]
      }),
      clear: vi.fn(() => {
        Object.keys(mockLocalStorage).forEach(key => {
          delete mockLocalStorage[key]
        })
      }),
      get length() {
        return Object.keys(mockLocalStorage).length
      },
      key: vi.fn((index: number) => Object.keys(mockLocalStorage)[index] || null),
    }

    // Mock both global and window localStorage
    global.localStorage = mockStorage as any
    ;(global as any).window = {
      localStorage: mockStorage,
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should get item from localStorage', () => {
    mockLocalStorage['test-key'] = 'test-value'

    const result = localStorageAdapter.get('test-key')

    expect(result).toBe('test-value')
    expect(global.localStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should return null for non-existent key', () => {
    const result = localStorageAdapter.get('non-existent')

    expect(result).toBeNull()
  })

  it('should set item in localStorage', () => {
    localStorageAdapter.set('test-key', 'test-value')

    expect(mockLocalStorage['test-key']).toBe('test-value')
    expect(global.localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      'test-value'
    )
  })

  it('should remove item from localStorage', () => {
    mockLocalStorage['test-key'] = 'test-value'

    localStorageAdapter.remove('test-key')

    expect(mockLocalStorage['test-key']).toBeUndefined()
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('test-key')
  })

  it('should handle localStorage errors gracefully', () => {
    const window = global as any
    window.window.localStorage.getItem = vi.fn(() => {
      throw new Error('Storage error')
    })

    const result = localStorageAdapter.get('test-key')

    expect(result).toBeNull()
  })
})

describe('sessionStorage adapter', () => {
  let mockSessionStorage: Record<string, string>

  beforeEach(() => {
    mockSessionStorage = {}

    // Define the mock sessionStorage object
    const mockStorage = {
      getItem: vi.fn((key: string) => mockSessionStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key]
      }),
      clear: vi.fn(() => {
        Object.keys(mockSessionStorage).forEach(key => {
          delete mockSessionStorage[key]
        })
      }),
      get length() {
        return Object.keys(mockSessionStorage).length
      },
      key: vi.fn((index: number) => Object.keys(mockSessionStorage)[index] || null),
    }

    // Mock both global and window sessionStorage
    global.sessionStorage = mockStorage as any
    ;(global as any).window.sessionStorage = mockStorage
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should get item from sessionStorage', () => {
    mockSessionStorage['test-key'] = 'test-value'

    const result = sessionStorageAdapter.get('test-key')

    expect(result).toBe('test-value')
    expect(global.sessionStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should set item in sessionStorage', () => {
    sessionStorageAdapter.set('test-key', 'test-value')

    expect(mockSessionStorage['test-key']).toBe('test-value')
    expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      'test-value'
    )
  })

  it('should remove item from sessionStorage', () => {
    mockSessionStorage['test-key'] = 'test-value'

    sessionStorageAdapter.remove('test-key')

    expect(mockSessionStorage['test-key']).toBeUndefined()
    expect(global.sessionStorage.removeItem).toHaveBeenCalledWith('test-key')
  })
})

describe('Memory storage', () => {
  it('should create new memory storage instance', () => {
    const storage = createMemoryStorage()

    expect(storage).toBeDefined()
    expect(storage.get).toBeInstanceOf(Function)
    expect(storage.set).toBeInstanceOf(Function)
    expect(storage.remove).toBeInstanceOf(Function)
  })

  it('should store and retrieve values', () => {
    const storage = createMemoryStorage()

    storage.set('key1', 'value1')
    storage.set('key2', 'value2')

    expect(storage.get('key1')).toBe('value1')
    expect(storage.get('key2')).toBe('value2')
  })

  it('should return null for non-existent keys', () => {
    const storage = createMemoryStorage()

    expect(storage.get('non-existent')).toBeNull()
  })

  it('should remove values', () => {
    const storage = createMemoryStorage()

    storage.set('key1', 'value1')
    storage.remove('key1')

    expect(storage.get('key1')).toBeNull()
  })

  it('should maintain separate storage per instance', () => {
    const storage1 = createMemoryStorage()
    const storage2 = createMemoryStorage()

    storage1.set('key', 'value1')

    expect(storage1.get('key')).toBe('value1')
    expect(storage2.get('key')).toBeNull()
  })
})

describe('createStorage', () => {
  it('should return localStorage adapter for "local" type', () => {
    const storage = createStorage('local')

    expect(storage).toBe(localStorageAdapter)
  })

  it('should return sessionStorage adapter for "session" type', () => {
    const storage = createStorage('session')

    expect(storage).toBe(sessionStorageAdapter)
  })

  it('should return new memory storage for "memory" type', () => {
    const storage = createStorage('memory')

    expect(storage).not.toBe(localStorageAdapter)
    expect(storage).not.toBe(sessionStorageAdapter)
    expect(storage.get).toBeInstanceOf(Function)
  })

  it('should return memory storage for unknown type', () => {
    const storage = createStorage('unknown' as any)

    expect(storage.get).toBeInstanceOf(Function)
  })
})
