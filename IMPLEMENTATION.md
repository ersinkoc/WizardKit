# WizardKit - Implementation Design Document

## Overview

This document describes the architecture, design decisions, and implementation details of WizardKit.

## Table of Contents

1. [Architecture](#architecture)
2. [Core Modules](#core-modules)
3. [State Management](#state-management)
4. [Navigation Logic](#navigation-logic)
5. [Validation System](#validation-system)
6. [Persistence Layer](#persistence-layer)
7. [Event System](#event-system)
8. [Middleware System](#middleware-system)
9. [Framework Adapters](#framework-adapters)
10. [Testing Strategy](#testing-strategy)
11. [Build System](#build-system)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         createWizard()                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          WizardInstance                          │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐  │
│  │   State      │  │   Events      │  │    Middleware        │  │
│  │   Manager    │◄─┤   Emitter     │◄─┤    Chain             │  │
│  └──────┬───────┘  └───────────────┘  └──────────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐  │
│  │   Step       │  │   Validation  │  │    Persistence       │  │
│  │   Manager    │  │   Engine      │  │    Manager           │  │
│  └──────────────┘  └───────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Design Patterns Used

1. **Factory Pattern**: `createWizard()` creates wizard instances
2. **Observer Pattern**: Event system for state changes
3. **Middleware Pattern**: Redux-style middleware for action interception
4. **Strategy Pattern**: Pluggable validation and persistence
5. **Builder Pattern**: Step definition with fluent API

---

## Core Modules

### 1. Types Module (`src/types.ts`)

**Purpose**: Centralized type definitions

**Key Types**:
```typescript
// Step definition
interface StepDefinition<TData> {
  id: string
  title: string
  condition?: (data: TData) => boolean
  conditions?: ((data: TData) => boolean)[]
  validate?: (data: TData) => ValidationErrors | null
  validateAsync?: (data: TData) => Promise<ValidationErrors | null>
  schema?: ValidationSchema
  branches?: Record<string, BranchDefinition>
  beforeEnter?: BeforeEnterHook
  onEnter?: OnEnterHook
  beforeLeave?: BeforeLeaveHook
  onLeave?: OnLeaveHook
}

// Wizard state
interface WizardState<TData> {
  currentStep: Step
  currentIndex: number
  steps: Step[]
  activeSteps: Step[]
  visibleSteps: Step[]
  data: TData
  errors: ValidationErrors
  history: string[]
  isFirst: boolean
  isLast: boolean
  isComplete: boolean
  canGoNext: boolean
  canGoPrev: boolean
  progress: number
  progressPercent: number
  completedSteps: number
  totalSteps: number
  isLoading: boolean
  isValidating: boolean
}

// Actions
type WizardAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; stepId: string }
  | { type: 'GO_TO_INDEX'; index: number }
  | { type: 'SET_DATA'; data: Partial<TData> }
  // ... more actions
```

**Implementation Notes**:
- All types use generics for type inference
- Actions are discriminated unions for type narrowing
- Event payload types are mapped from event names

---

### 2. Event Emitter (`src/events/emitter.ts`)

**Purpose**: Pub/sub system for wizard events

**Implementation**:
```typescript
class EventEmitter<E extends Record<string, any>> {
  private listeners: Map<keyof E, Set<Function>> = new Map()

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

  off<K extends keyof E>(
    event: K,
    handler: (payload: E[K]) => void
  ): void {
    this.listeners.get(event)?.delete(handler)
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    this.listeners.get(event)?.forEach(handler => handler(payload))
  }

  once<K extends keyof E>(
    event: K,
    handler: (payload: E[K]) => void
  ): void {
    const wrapped = (payload: E[K]) => {
      handler(payload)
      this.off(event, wrapped)
    }
    this.on(event, wrapped)
  }

  clear(): void {
    this.listeners.clear()
  }
}
```

**Design Decisions**:
- Using `Map` and `Set` for O(1) add/remove
- Generic type parameter for type-safe events
- `on()` returns unsubscribe function for convenience
- `once()` implemented as wrapper that auto-unsubscribes

---

### 3. Validation Engine (`src/validation/`)

**Architecture**:
```
ValidationEngine
├── validator.ts      # Main validation orchestrator
├── schema.ts         # Schema-based validation
├── rules.ts          # Built-in validation rules
└── async.ts          # Async validation handler
```

**Validator Implementation**:
```typescript
class ValidationEngine<TData> {
  // Function-based validation
  validate(
    data: TData,
    validator?: ValidateFn<TData>
  ): ValidationErrors | null {
    if (!validator) return null
    return validator(data)
  }

  // Async validation
  async validateAsync(
    data: TData,
    validator?: ValidateAsyncFn<TData>
  ): Promise<ValidationErrors | null> {
    if (!validator) return null
    return await validator(data)
  }

  // Schema-based validation
  validateSchema(
    data: TData,
    schema: ValidationSchema
  ): ValidationErrors | null {
    const errors: ValidationErrors = {}

    for (const [field, validation] of Object.entries(schema)) {
      const value = data[field]
      const fieldErrors = this.validateField(value, validation, data)
      if (fieldErrors) {
        errors[field] = fieldErrors
      }
    }

    return Object.keys(errors).length > 0 ? errors : null
  }

  // Combined validation (schema + async)
  async validateAll(
    data: TData,
    step: StepDefinition<TData>
  ): Promise<ValidationErrors | null> {
    // 1. Schema validation
    let errors = this.validateSchema(data, step.schema || {})

    // 2. Function validation
    const fnErrors = this.validate(data, step.validate)
    if (fnErrors) {
      errors = { ...errors, ...fnErrors }
    }

    // 3. Async validation
    const asyncErrors = await this.validateAsync(data, step.validateAsync)
    if (asyncErrors) {
      errors = { ...errors, ...asyncErrors }
    }

    return Object.keys(errors).length > 0 ? errors : null
  }
}
```

**Built-in Rules** (`rules.ts`):
```typescript
export const validationRules = {
  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  },

  minLength: (value: unknown, min: number): boolean => {
    if (typeof value !== 'string') return false
    return value.length >= min
  },

  maxLength: (value: unknown, max: number): boolean => {
    if (typeof value !== 'string') return false
    return value.length <= max
  },

  min: (value: unknown, min: number): boolean => {
    if (typeof value !== 'number') return false
    return value >= min
  },

  max: (value: unknown, max: number): boolean => {
    if (typeof value !== 'number') return false
    return value <= max
  },

  pattern: (value: unknown, regex: RegExp): boolean => {
    if (typeof value !== 'string') return false
    return regex.test(value)
  },

  email: (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  url: (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },

  custom: (value: unknown, fn: (v: unknown) => boolean): boolean => {
    return fn(value)
  }
}
```

---

### 4. Persistence Layer (`src/persistence/`)

**Architecture**:
```
PersistenceManager
├── storage.ts        # Storage interface
├── local.ts          # localStorage adapter
├── session.ts        # sessionStorage adapter
└── memory.ts         # In-memory adapter
```

**Storage Interface**:
```typescript
interface PersistStorage {
  get(key: string): string | null | Promise<string | null>
  set(key: string, value: string): void | Promise<void>
  remove(key: string): void | Promise<void>
}
```

**Built-in Adapters**:
```typescript
// localStorage
export const localStorageAdapter: PersistStorage = {
  get: (key) => localStorage.getItem(key),
  set: (key, value) => localStorage.setItem(key, value),
  remove: (key) => localStorage.removeItem(key)
}

// sessionStorage
export const sessionStorageAdapter: PersistStorage = {
  get: (key) => sessionStorage.getItem(key),
  set: (key, value) => sessionStorage.setItem(key, value),
  remove: (key) => sessionStorage.removeItem(key)
}

// In-memory
export const memoryAdapter = (): PersistStorage => {
  const store = new Map<string, string>()
  return {
    get: (key) => store.get(key) || null,
    set: (key, value) => store.set(key, value),
    remove: (key) => store.delete(key)
  }
}
```

**Persistence Manager**:
```typescript
class PersistenceManager<TData> {
  private storage: PersistStorage
  private key: string
  private debounceTimer: number | null = null
  private debounceMs: number

  constructor(config: PersistenceConfig) {
    this.key = config.key
    this.debounceMs = config.debounce || 300
    this.storage = this.createStorage(config.storage)
  }

  private createStorage(
    storage: 'local' | 'session' | PersistStorage
  ): PersistStorage {
    if (typeof storage === 'string') {
      return storage === 'local' ? localStorageAdapter : sessionStorageAdapter
    }
    return storage
  }

  save(state: WizardState<TData>): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      const data = this.serialize(state)
      this.storage.set(this.key, data)
    }, this.debounceMs) as unknown as number
  }

  async restore(): Promise<Partial<WizardState<TData>> | null> {
    const data = await this.storage.get(this.key)
    if (!data) return null
    return this.deserialize(data)
  }

  clear(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.storage.remove(this.key)
  }

  private serialize(state: WizardState<TData>): string {
    return JSON.stringify({
      data: state.data,
      currentStep: state.currentStep.id,
      history: state.history
    })
  }

  private deserialize(data: string): Partial<WizardState<TData>> {
    return JSON.parse(data)
  }
}
```

---

### 5. Step Manager (`src/core/step.ts`)

**Purpose**: Manage step definitions and computed step properties

**Implementation**:
```typescript
class StepManager {
  private definitions: StepDefinition[]
  private data: Record<string, unknown>

  constructor(steps: StepDefinition[], initialData: Record<string, unknown>) {
    this.definitions = steps
    this.data = initialData
  }

  // Get all steps (as Step objects with computed properties)
  getSteps(): Step[] {
    return this.definitions.map((def, index) => ({
      ...def,
      index,
      isActive: this.isStepActive(def),
      isCompleted: this.isStepCompleted(def),
      isCurrent: false,  // Set by state manager
      isUpcoming: !this.isStepActive(def),
      isDisabled: this.isStepDisabled(def),
      canSkip: this.canStepSkip(def),
      hasError: false,   // Set by state manager
      errors: {}
    }))
  }

  // Get active steps (pass conditions)
  getActiveSteps(): Step[] {
    return this.getSteps().filter(step => step.isActive)
  }

  // Check if step passes conditions
  private isStepActive(step: StepDefinition): boolean {
    if (step.condition && !step.condition(this.data, {})) {
      return false
    }

    if (step.conditions) {
      return step.conditions.every(fn => fn(this.data, {}))
    }

    return true
  }

  // Check if step is disabled
  private isStepDisabled(step: StepDefinition): boolean {
    if (typeof step.disabled === 'boolean') return step.disabled
    if (typeof step.disabled === 'function') return step.disabled(this.data)
    return false
  }

  // Check if step can be skipped
  private canStepSkip(step: StepDefinition): boolean {
    if (typeof step.canSkip === 'boolean') return step.canSkip
    if (typeof step.canSkip === 'function') return step.canSkip(this.data)
    return false
  }

  // Find step by ID
  findById(id: string): Step | undefined {
    return this.getSteps().find(s => s.id === id)
  }

  // Find step by index
  findByIndex(index: number): Step | undefined {
    return this.getSteps()[index]
  }

  // Update data reference
  updateData(data: Record<string, unknown>): void {
    this.data = data
  }
}
```

---

### 6. State Manager (`src/core/state.ts`)

**Purpose**: Immutable state management with computed properties

**State Structure**:
```typescript
interface InternalState<TData> {
  // Core state
  currentIndex: number
  data: TData
  errors: Map<string, ValidationErrors>
  history: string[]
  isComplete: boolean
  isLoading: boolean
  isValidating: boolean

  // Managers
  stepManager: StepManager
  validationEngine: ValidationEngine
}
```

**Implementation**:
```typescript
class StateManager<TData> {
  private state: InternalState<TData>
  private listeners: Set<(state: WizardState<TData>) => void> = new Set()

  constructor(config: WizardConfig<TData>) {
    this.state = {
      currentIndex: this.getInitialIndex(config.initialStep, config.steps),
      data: { ...config.initialData } as TData,
      errors: new Map(),
      history: [],
      isComplete: false,
      isLoading: false,
      isValidating: false,
      stepManager: new StepManager(config.steps, config.initialData),
      validationEngine: new ValidationEngine()
    }
  }

  // Get public state (computed properties)
  getState(): WizardState<TData> {
    const steps = this.state.stepManager.getSteps()
    const activeSteps = this.state.stepManager.getActiveSteps()
    const currentStep = steps[this.state.currentIndex]

    return {
      currentStep: { ...currentStep, isCurrent: true },
      currentIndex: this.state.currentIndex,
      steps,
      activeSteps,
      visibleSteps: this.getVisibleSteps(steps, activeSteps),
      data: this.state.data,
      errors: this.getCurrentErrors(),
      history: [...this.state.history],
      isFirst: this.state.currentIndex === 0,
      isLast: this.state.currentIndex === activeSteps.length - 1,
      isComplete: this.state.isComplete,
      canGoNext: this.canGoNext(),
      canGoPrev: this.state.currentIndex > 0,
      progress: this.calculateProgress(),
      progressPercent: this.calculateProgress() * 100,
      completedSteps: this.state.currentIndex,
      totalSteps: activeSteps.length,
      isLoading: this.state.isLoading,
      isValidating: this.state.isValidating
    }
  }

  // Immutable state update
  setState(updater: (state: InternalState<TData>) => InternalState<TData>): void {
    const prevState = this.getState()
    this.state = updater(this.state)
    const newState = this.getState()

    // Notify subscribers if state changed
    if (prevState !== newState) {
      this.notifyListeners(newState, prevState)
    }
  }

  subscribe(
    handler: (state: WizardState<TData>, prevState: WizardState<TData>) => void
  ): () => void {
    this.listeners.add(handler)
    return () => this.listeners.delete(handler)
  }

  private notifyListeners(
    state: WizardState<TData>,
    prevState: WizardState<TData>
  ): void {
    this.listeners.forEach(fn => fn(state, prevState))
  }

  private calculateProgress(): number {
    const activeSteps = this.state.stepManager.getActiveSteps().length
    if (activeSteps === 0) return 0
    return this.state.currentIndex / activeSteps
  }

  private canGoNext(): boolean {
    const activeSteps = this.state.stepManager.getActiveSteps()
    return this.state.currentIndex < activeSteps.length - 1
  }

  private getCurrentErrors(): ValidationErrors {
    const currentStep = this.state.stepManager.getSteps()[this.state.currentIndex]
    return this.state.errors.get(currentStep.id) || {}
  }
}
```

---

### 7. Navigation Logic (`src/core/navigation.ts`)

**Purpose**: Handle all navigation operations

**Implementation**:
```typescript
class NavigationController<TData> {
  private stateManager: StateManager<TData>
  private eventEmitter: EventEmitter<WizardEventMap>
  private validationEngine: ValidationEngine<TData>

  constructor(
    stateManager: StateManager<TData>,
    eventEmitter: EventEmitter<WizardEventMap>,
    validationEngine: ValidationEngine<TData>
  ) {
    this.stateManager = stateManager
    this.eventEmitter = eventEmitter
    this.validationEngine = validationEngine
  }

  async next(): Promise<boolean> {
    const state = this.stateManager.getState()

    // Check if can go next
    if (state.isLast) {
      return await this.complete()
    }

    // Validate current step if needed
    const currentStepDef = this.getStepDefinition(state.currentStep.id)
    if (currentStepDef?.validateOnNext !== false) {
      const errors = await this.validateCurrentStep()
      if (errors) {
        this.eventEmitter.emit('validation:error', {
          step: state.currentStep,
          errors
        })
        return false
      }
    }

    // Calculate next step
    const nextStep = this.calculateNextStep(state)
    if (!nextStep) return false

    // Navigate
    return await this.goToStep(nextStep, 'next')
  }

  async prev(): Promise<boolean> {
    const state = this.stateManager.getState()

    if (state.isFirst) return false

    // Validate if configured
    if (this.config.validateOnPrev) {
      const errors = await this.validateCurrentStep()
      if (errors) return false
    }

    // Calculate previous step
    const prevStep = this.calculatePrevStep(state)
    if (!prevStep) return false

    return await this.goToStep(prevStep, 'prev')
  }

  async goTo(stepId: string): Promise<boolean> {
    const state = this.stateManager.getState()
    const targetStep = state.steps.find(s => s.id === stepId)

    if (!targetStep || !targetStep.isActive) {
      return false
    }

    // Check if linear mode
    if (this.config.linear && !this.isReachable(stepId)) {
      return false
    }

    return await this.goToStep(targetStep, 'jump')
  }

  private async goToStep(
    targetStep: Step,
    direction: NavigationDirection
  ): Promise<boolean> {
    const state = this.stateManager.getState()
    const currentStepDef = this.getStepDefinition(state.currentStep.id)
    const targetStepDef = this.getStepDefinition(targetStep.id)

    // beforeLeave hook
    if (currentStepDef?.beforeLeave) {
      const result = await this.executeHook(currentStepDef.beforeLeave, direction)
      if (result?.block) {
        return false
      }
    }

    // beforeEnter hook
    if (targetStepDef?.beforeEnter) {
      const canEnter = await this.executeHook(targetStepDef.beforeEnter)
      if (!canEnter) {
        return false
      }
    }

    // Update state
    const prevStep = state.currentStep
    this.stateManager.setState(state => ({
      ...state,
      currentIndex: targetStep.index,
      history: [...state.history, state.currentStep.id]
    }))

    // Emit events
    this.eventEmitter.emit('step:leave', { step: prevStep, direction })
    this.eventEmitter.emit('step:enter', { step: targetStep, direction })
    this.eventEmitter.emit('step:change', {
      step: targetStep,
      direction,
      prevStep
    })

    // onLeave hook
    if (currentStepDef?.onLeave) {
      currentStepDef.onLeave(state.data, this.wizard, direction)
    }

    // onEnter hook
    if (targetStepDef?.onEnter) {
      targetStepDef.onEnter(state.data, this.wizard, direction)
    }

    return true
  }

  private calculateNextStep(state: WizardState<TData>): Step | null {
    const currentStepDef = this.getStepDefinition(state.currentStep.id)

    // Check for branches
    if (currentStepDef?.branches) {
      for (const branch of Object.values(currentStepDef.branches)) {
        if (branch.condition(state.data)) {
          return state.steps.find(s => s.id === branch.nextStep)
        }
      }
    }

    // Use nextStep function
    if (currentStepDef?.nextStep) {
      const nextId = typeof currentStepDef.nextStep === 'function'
        ? currentStepDef.nextStep(state.data)
        : currentStepDef.nextStep
      return state.steps.find(s => s.id === nextId)
    }

    // Default: next active step
    const activeSteps = state.activeSteps
    const currentIndex = activeSteps.findIndex(s => s.id === state.currentStep.id)
    return activeSteps[currentIndex + 1] || null
  }

  private calculatePrevStep(state: WizardState<TData>): Step | null {
    const currentStepDef = this.getStepDefinition(state.currentStep.id)

    // Use prevStep function
    if (currentStepDef?.prevStep) {
      const prevId = typeof currentStepDef.prevStep === 'function'
        ? currentStepDef.prevStep(state.data)
        : currentStepDef.prevStep
      return state.steps.find(s => s.id === prevId)
    }

    // Default: previous in history
    if (state.history.length > 0) {
      const prevId = state.history[state.history.length - 1]
      return state.steps.find(s => s.id === prevId)
    }

    return null
  }
}
```

---

### 8. Middleware System (`src/core/middleware.ts`)

**Purpose**: Allow intercepting and modifying actions

**Implementation**:
```typescript
class MiddlewareManager<TData> {
  private middleware: WizardMiddleware<TData>[] = []

  use(middleware: WizardMiddleware<TData>): () => void {
    this.middleware.push(middleware)
    return () => {
      const index = this.middleware.indexOf(middleware)
      if (index > -1) {
        this.middleware.splice(index, 1)
      }
    }
  }

  async execute(
    action: WizardAction,
    initialState: InternalState<TData>,
    reducer: (state: InternalState<TData>, action: WizardAction) => InternalState<TData>,
    stateManager: StateManager<TData>
  ): Promise<InternalState<TData>> {
    let index = 0
    let state = initialState

    const dispatch = async (action: WizardAction): Promise<void> => {
      state = reducer(state, action)
    }

    const getState = (): WizardState<TData> => {
      return stateManager.getState()
    }

    // Execute middleware chain
    const next = async (action: WizardAction): Promise<void> => {
      if (index < this.middleware.length) {
        const mw = this.middleware[index++]
        await mw(action, next, getState)
      } else {
        await dispatch(action)
      }
    }

    await next(action)
    return state
  }
}
```

---

### 9. Main Wizard Class (`src/core/wizard.ts`)

**Purpose**: Orchestrates all components into a cohesive API

**Implementation Structure**:
```typescript
class Wizard<TData> implements WizardInstance<TData> {
  // Private components
  private config: WizardConfig<TData>
  private stateManager: StateManager<TData>
  private eventEmitter: EventEmitter<WizardEventMap>
  private validationEngine: ValidationEngine<TData>
  private navigationController: NavigationController<TData>
  private persistenceManager: PersistenceManager<TData> | null
  private middlewareManager: MiddlewareManager<TData>
  private destroyed: boolean = false

  constructor(config: WizardConfig<TData>) {
    this.config = config

    // Initialize components
    this.stateManager = new StateManager(config)
    this.eventEmitter = new EventEmitter<WizardEventMap>()
    this.validationEngine = new ValidationEngine()
    this.navigationController = new NavigationController(
      this.stateManager,
      this.eventEmitter,
      this.validationEngine
    )
    this.middlewareManager = new MiddlewareManager()

    // Initialize persistence if configured
    if (config.persistKey) {
      this.persistenceManager = new PersistenceManager({
        key: config.persistKey,
        storage: config.persistStorage || 'local',
        debounce: config.persistDebounce
      })
    }

    // Restore persisted state
    this.restore()

    // Setup auto-persist
    if (this.persistenceManager) {
      this.stateManager.subscribe((state) => {
        this.persistenceManager!.save(state)
      })
    }
  }

  // ===== STATE GETTERS =====
  getState(): WizardState<TData> {
    this.checkDestroyed()
    return this.stateManager.getState()
  }

  get currentStep(): Step {
    return this.getState().currentStep
  }

  get data(): TData {
    return this.getState().data
  }

  // ... other getters

  // ===== NAVIGATION =====
  async next(): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.next()
  }

  async prev(): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.prev()
  }

  async goTo(stepId: string): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.goTo(stepId)
  }

  // ... other navigation methods

  // ===== DATA MANAGEMENT =====
  getData(): TData
  getData<K extends keyof TData>(field: K): TData[K]
  getData<K extends keyof TData>(fields: K[]): Pick<TData, K>
  getData(fieldOrFields?: keyof TData | keyof TData[]): any {
    const state = this.getState()
    if (!fieldOrFields) return state.data
    if (Array.isArray(fieldOrFields)) {
      const result: Partial<TData> = {}
      fieldOrFields.forEach(f => result[f] = state.data[f])
      return result
    }
    return state.data[fieldOrFields]
  }

  setData(data: Partial<TData>, replace = false): void {
    this.checkDestroyed()
    const changedFields = Object.keys(data)

    this.stateManager.setState(state => ({
      ...state,
      data: replace ? { ...data } as TData : { ...state.data, ...data }
    }))

    this.eventEmitter.emit('data:change', {
      data: this.getState().data,
      changedFields
    })
  }

  // ===== VALIDATION =====
  async validate(): Promise<ValidationErrors | null> {
    this.checkDestroyed()
    const state = this.getState()
    const stepDef = this.getStepDefinition(state.currentStep.id)
    if (!stepDef) return null

    this.stateManager.setState(s => ({ ...s, isValidating: true }))

    const errors = await this.validationEngine.validateAll(
      state.data,
      stepDef
    )

    this.stateManager.setState(s => ({
      ...s,
      isValidating: false,
      errors: errors
        ? new Map([[state.currentStep.id, errors]])
        : new Map()
    }))

    if (errors) {
      this.eventEmitter.emit('validation:error', {
        step: state.currentStep,
        errors
      })
    } else {
      this.eventEmitter.emit('validation:success', {
        step: state.currentStep
      })
    }

    return errors
  }

  // ===== EVENTS =====
  on<E extends WizardEvent>(
    event: E,
    handler: WizardEventHandler<E>
  ): Unsubscribe {
    this.checkDestroyed()
    return this.eventEmitter.on(event, handler)
  }

  // ===== MIDDLEWARE =====
  use(middleware: WizardMiddleware<TData>): Unsubscribe {
    this.checkDestroyed()
    return this.middlewareManager.use(middleware)
  }

  // ===== DISPATCH =====
  async dispatch(action: WizardAction): Promise<void> {
    this.checkDestroyed()
    const reducer = this.createReducer()
    const newState = await this.middlewareManager.execute(
      action,
      this.stateManager.getInternalState(),
      reducer,
      this.stateManager
    )
    this.stateManager.setState(() => newState)
  }

  // ===== LIFECYCLE =====
  destroy(): void {
    if (this.destroyed) return

    this.eventEmitter.clear()
    this.middlewareManager.clear()
    this.persistenceManager?.clear()

    this.destroyed = true
  }

  private checkDestroyed(): void {
    if (this.destroyed) {
      throw new Error('Wizard instance has been destroyed')
    }
  }
}
```

---

## Framework Adapters

### React Adapter

**Architecture**:
```
@oxog/wizardkit/react
├── provider.tsx         # WizardProvider component
├── context.ts           # React context
├── hooks/
│   ├── useWizard.ts     # Main hook
│   ├── useWizardStep.ts # Step-specific hook
│   └── ...
└── components/
    ├── WizardStepper.tsx
    ├── WizardContent.tsx
    └── ...
```

**Provider Implementation**:
```typescript
const WizardContext = createContext<WizardInstance | null>(null)

export function WizardProvider({
  wizard,
  children,
  onComplete,
  onCancel
}: WizardProviderProps) {
  useEffect(() => {
    if (onComplete) {
      const unsub = wizard.on('complete', onComplete)
      return unsub
    }
  }, [wizard, onComplete])

  useEffect(() => {
    if (onCancel) {
      const unsub = wizard.on('cancel', onCancel)
      return unsub
    }
  }, [wizard, onCancel])

  return (
    <WizardContext.Provider value={wizard}>
      {children}
    </WizardContext.Provider>
  )
}
```

**useWizard Hook**:
```typescript
export function useWizard<TData = Record<string, unknown>>() {
  const wizard = useContext(WizardContext)
  if (!wizard) {
    throw new Error('useWizard must be used within WizardProvider')
  }

  const [, forceUpdate] = useState({})

  // Subscribe to state changes
  useEffect(() => {
    const unsub = wizard.subscribe(() => forceUpdate({}))
    return unsub
  }, [wizard])

  return {
    // State
    currentStep: wizard.currentStep,
    data: wizard.data,
    errors: wizard.errors,
    progress: wizard.progress,
    // ... other state

    // Methods
    next: () => wizard.next(),
    prev: () => wizard.prev(),
    setData: (data: Partial<TData>) => wizard.setData(data),
    // ... other methods

    // Raw instance
    wizard
  }
}
```

### Vue Adapter

**Composable Implementation**:
```typescript
export function useWizard<TData = Record<string, unknown>>(config?: WizardConfig) {
  const wizard = ref<WizardInstance<TData> | null>(null)
  const state = ref<WizardState<TData> | null>(null)

  if (config && !wizard.value) {
    wizard.value = createWizard<TData>(config)

    // Subscribe to state changes
    wizard.value.subscribe((newState) => {
      state.value = newState
    })

    state.value = wizard.value.getState()
  }

  return {
    state,
    wizard,
    // Computed properties
    currentStep: computed(() => state.value?.currentStep),
    data: computed(() => state.value?.data),
    // ... methods
  }
}
```

### Svelte Adapter

**Store Implementation**:
```typescript
export function createWizardStore<TData>(config: WizardConfig<TData>) {
  const wizard = createWizard<TData>(config)

  const { subscribe } = derived(
    writable(wizard),
    ($wizard) => $wizard.getState()
  )

  return {
    subscribe,
    // Actions
    next: () => wizard.next(),
    prev: () => wizard.prev(),
    setData: (data: Partial<TData>) => wizard.setData(data),
    // ...
  }
}
```

---

## Testing Strategy

### Unit Tests

**Coverage Requirements**: 100%

**Test Structure**:
```
tests/
├── unit/
│   ├── validation/
│   │   ├── validator.test.ts
│   │   ├── rules.test.ts
│   │   └── schema.test.ts
│   ├── events/
│   │   └── emitter.test.ts
│   ├── persistence/
│   │   ├── local.test.ts
│   │   └── manager.test.ts
│   └── core/
│       ├── step.test.ts
│       ├── state.test.ts
│       └── navigation.test.ts
```

**Example Test**:
```typescript
describe('ValidationEngine', () => {
  it('should validate required fields', () => {
    const engine = new ValidationEngine()
    const schema = {
      name: { required: true }
    }

    const errors = engine.validateSchema({}, schema)
    expect(errors).toEqual({ name: 'Field is required' })
  })

  it('should pass validation with valid data', () => {
    const engine = new ValidationEngine()
    const schema = {
      name: { required: true, minLength: 2 }
    }

    const errors = engine.validateSchema({ name: 'John' }, schema)
    expect(errors).toBeNull()
  })
})
```

### Integration Tests

**Test Scenarios**:
1. **Basic Navigation**: Next/prev through all steps
2. **Conditional Steps**: Show/hide based on data
3. **Branching**: Navigate different paths
4. **Validation**: Block navigation on errors
5. **Persistence**: Save/restore state
6. **Lifecycle Hooks**: Execute in correct order

```typescript
describe('Wizard - Integration', () => {
  it('should navigate through all steps', async () => {
    const wizard = createWizard({
      steps: [
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' }
      ]
    })

    expect(wizard.currentStep.id).toBe('step1')
    await wizard.next()
    expect(wizard.currentStep.id).toBe('step2')
    await wizard.next()
    expect(wizard.currentStep.id).toBe('step3')
  })

  it('should show conditional steps', async () => {
    const wizard = createWizard({
      steps: [
        { id: 'type', title: 'Type' },
        {
          id: 'premium',
          title: 'Premium',
          condition: (data) => data.type === 'premium'
        },
        { id: 'confirm', title: 'Confirm' }
      ]
    })

    expect(wizard.activeSteps.length).toBe(2)

    wizard.setData({ type: 'premium' })
    expect(wizard.activeSteps.length).toBe(3)
  })
})
```

---

## Build System

### Build Configuration

**tsup.config.ts**:
```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/adapters/react/index.ts',
    vue: 'src/adapters/vue/index.ts',
    svelte: 'src/adapters/svelte/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom', 'vue', 'svelte'],
  treeshake: true
})
```

### Bundle Size Targets

| Package | Target | Max |
|---------|--------|-----|
| Core | minified + gzipped | 4KB |
| React | minified + gzipped | 2KB |
| Vue | minified + gzipped | 2KB |
| Svelte | minified + gzipped | 2KB |

### Optimization Techniques

1. **Tree Shaking**: ESM with proper exports
2. **Code Splitting**: Separate entry points
3. **Minification**: esbuild via tsup
4. **External Dependencies**: Peer dependencies for frameworks
5. **Type Stripping**: Separate .d.ts files

---

## Summary

This implementation design provides:

1. **Modular Architecture**: Separation of concerns with dedicated managers
2. **Type Safety**: Full TypeScript with strict mode
3. **Zero Dependencies**: All functionality implemented from scratch
4. **Performance**: Efficient state management and event system
5. **Extensibility**: Middleware and event hooks for customization
6. **Framework Support**: Adapters for React, Vue, and Svelte
7. **Testability**: 100% coverage with unit and integration tests

---

**Document Status**: Complete
**Last Updated**: 2025-12-28
**Author**: Ersin KOÇ
