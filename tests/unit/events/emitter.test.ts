import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from '../../../src/events/emitter.js'

interface TestEvents {
  test: string
  foo: number
  error: never
}

describe('EventEmitter', () => {
  it('should create an emitter instance', () => {
    const emitter = new EventEmitter<TestEvents>()
    expect(emitter).toBeDefined()
    expect(emitter instanceof EventEmitter).toBe(true)
  })

  it('should subscribe to and emit events', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('test', handler)
    emitter.emit('test', 'hello')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('hello')
  })

  it('should support multiple listeners for the same event', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('test', handler1)
    emitter.on('test', handler2)
    emitter.emit('test', 'hello')

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('should unsubscribe from events', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    const unsub = emitter.on('test', handler)
    unsub()
    emitter.emit('test', 'hello')

    expect(handler).not.toHaveBeenCalled()
  })

  it('should remove specific listeners with off', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('test', handler1)
    emitter.on('test', handler2)
    emitter.off('test', handler1)
    emitter.emit('test', 'hello')

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('should support one-time listeners with once', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.once('test', handler)
    emitter.emit('test', 'hello')
    emitter.emit('test', 'world')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('hello')
  })

  it('should clear all listeners', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('test', handler1)
    emitter.on('foo', handler2)
    emitter.clear()
    emitter.emit('test', 'hello')
    emitter.emit('foo', 42)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
  })

  it('should get listener count', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    expect(emitter.listenerCount('test')).toBe(0)

    emitter.on('test', handler1)
    expect(emitter.listenerCount('test')).toBe(1)

    emitter.on('test', handler2)
    expect(emitter.listenerCount('test')).toBe(2)

    emitter.off('test', handler1)
    expect(emitter.listenerCount('test')).toBe(1)
  })

  it('should check if event has listeners', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    expect(emitter.hasListeners('test')).toBe(false)

    emitter.on('test', handler)
    expect(emitter.hasListeners('test')).toBe(true)

    emitter.off('test', handler)
    expect(emitter.hasListeners('test')).toBe(false)
  })

  it('should handle errors in handlers gracefully', () => {
    const emitter = new EventEmitter<TestEvents>()
    const errorHandler = vi.fn(() => {
      throw new Error('Test error')
    })
    const normalHandler = vi.fn()

    // Should not throw
    expect(() => {
      emitter.on('test', errorHandler)
      emitter.on('test', normalHandler)
      emitter.emit('test', 'hello')
    }).not.toThrow()

    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(normalHandler).toHaveBeenCalledTimes(1)
  })

  it('should return unsubscribe function from on', () => {
    const emitter = new EventEmitter<TestEvents>()
    const handler = vi.fn()

    const unsub = emitter.on('test', handler)
    expect(typeof unsub).toBe('function')

    unsub()
    emitter.emit('test', 'hello')

    expect(handler).not.toHaveBeenCalled()
  })
})
