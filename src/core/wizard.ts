import type {
  WizardInstance,
  WizardConfig,
  WizardState,
  WizardAction,
  Step,
  ValidationErrors,
  NavigationDirection,
  Unsubscribe,
  WizardMiddleware,
  WizardEvent,
  WizardEventHandler,
} from '../types.js'
import type { EventEmitter } from '../events/emitter.js'
import type { WizardEventMap } from '../types.js'
import { StateManager } from './state.js'
import { NavigationController } from './navigation.js'
import { MiddlewareManager } from './middleware.js'
import { PersistenceManager, createPersistenceManager } from '../persistence/manager.js'
import { EventEmitter as createEventEmitter } from '../events/emitter.js'

/**
 * Main Wizard class
 * Orchestrates all components into a cohesive API
 */
export class Wizard<TData = Record<string, unknown>>
  implements WizardInstance<TData>
{
  // Private components
  private config: WizardConfig<TData>
  private stateManager: StateManager<TData>
  private eventEmitter: EventEmitter<WizardEventMap>
  private navigationController: NavigationController<TData>
  private persistenceManager: PersistenceManager<TData> | null = null
  private middlewareManager: MiddlewareManager<TData>
  private destroyed: boolean = false

  // Callbacks from config
  private callbacks: {
    onStepChange?: (step: Step, direction: NavigationDirection, data: TData) => void
    onDataChange?: (data: TData, changedFields: string[]) => void
    onValidationError?: (step: Step, errors: ValidationErrors) => void
    onComplete?: (data: TData) => void | Promise<void>
    onCancel?: (data: TData, step: Step) => void
  }

  constructor(config: WizardConfig<TData>) {
    this.config = config
    this.callbacks = {
      onStepChange: config.onStepChange,
      onDataChange: config.onDataChange,
      onValidationError: config.onValidationError,
      onComplete: config.onComplete,
      onCancel: config.onCancel,
    }

    // Initialize components
    this.stateManager = new StateManager<TData>(config)
    this.eventEmitter = new createEventEmitter<WizardEventMap>()
    this.middlewareManager = new MiddlewareManager<TData>()

    // Initialize navigation controller
    this.navigationController = new NavigationController<TData>(
      this.stateManager,
      this.eventEmitter,
      {
        linear: config.linear ?? true,
        validateOnNext: config.validateOnNext ?? true,
        validateOnPrev: config.validateOnPrev ?? false,
      }
    )

    // Initialize persistence if configured
    if (config.persistKey) {
      this.persistenceManager = createPersistenceManager<TData>({
        key: config.persistKey,
        storage: config.persistStorage || 'local',
        debounce: config.persistDebounce,
        fields: config.persistFields,
      })
    }

    // Setup internal event handlers
    this.setupEventHandlers()

    // Restore persisted state if available
    if (this.persistenceManager) {
      this.restore()
    }

    // Setup auto-persist
    if (this.persistenceManager) {
      this.stateManager.subscribe((state) => {
        this.persistenceManager!.save(state)
      })
    }
  }

  /**
   * Setup internal event handlers
   */
  private setupEventHandlers(): void {
    // step:change
    this.eventEmitter.on('step:change', ({ step, direction }) => {
      if (this.callbacks.onStepChange) {
        this.callbacks.onStepChange(step, direction, this.data)
      }
    })

    // data:change
    this.eventEmitter.on('data:change', ({ data, changedFields }) => {
      if (this.callbacks.onDataChange) {
        this.callbacks.onDataChange(data as TData, changedFields)
      }
    })

    // validation:error
    this.eventEmitter.on('validation:error', ({ step, errors }) => {
      if (this.callbacks.onValidationError) {
        this.callbacks.onValidationError(step, errors)
      }
    })

    // complete
    this.eventEmitter.on('complete', async ({ data }) => {
      if (this.callbacks.onComplete) {
        await this.callbacks.onComplete(data as TData)
      }
    })
  }

  /**
   * Check if wizard has been destroyed
   */
  private checkDestroyed(): void {
    if (this.destroyed) {
      throw new Error('Wizard instance has been destroyed')
    }
  }

  // ===== STATE GETTERS =====

  getState(): WizardState<TData> {
    this.checkDestroyed()
    return this.stateManager.getState() as WizardState<TData>
  }

  get currentStep(): Step {
    return this.getState().currentStep
  }

  get currentIndex(): number {
    return this.getState().currentIndex
  }

  get steps(): Step[] {
    return this.getState().steps
  }

  get activeSteps(): Step[] {
    return this.getState().activeSteps
  }

  get data(): TData {
    return this.getState().data
  }

  get errors(): ValidationErrors {
    return this.getState().errors
  }

  get history(): string[] {
    return this.getState().history
  }

  get progress(): number {
    return this.getState().progress
  }

  get progressPercent(): number {
    return this.getState().progressPercent
  }

  get isFirst(): boolean {
    return this.getState().isFirst
  }

  get isLast(): boolean {
    return this.getState().isLast
  }

  get isComplete(): boolean {
    return this.getState().isComplete
  }

  get canGoNext(): boolean {
    return this.getState().canGoNext
  }

  get canGoPrev(): boolean {
    return this.getState().canGoPrev
  }

  get isLoading(): boolean {
    return this.getState().isLoading
  }

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

  async goToIndex(index: number): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.goToIndex(index)
  }

  async first(): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.first()
  }

  async last(): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.last()
  }

  async skip(): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.skip()
  }

  reset(): void {
    this.checkDestroyed()

    // Emit reset event
    this.eventEmitter.emit('reset', {})

    // Reset state to initial
    const initialData = (this.config.initialData as TData) ?? ({} as TData)
    this.stateManager.setState((s) => ({
      ...s,
      currentIndex: 0,
      data: initialData,
      history: [],
      isComplete: false,
      errors: new Map(),
    }))

    // Clear errors
    this.stateManager.getStepManager().clearErrors()
  }

  async complete(): Promise<boolean> {
    this.checkDestroyed()
    return await this.navigationController.complete()
  }

  cancel(): void {
    this.checkDestroyed()

    const state = this.getState()

    // Emit cancel event
    this.eventEmitter.emit('cancel', {
      data: state.data as Record<string, unknown>,
      step: state.currentStep,
    })

    // Call callback
    if (this.callbacks.onCancel) {
      this.callbacks.onCancel(state.data, state.currentStep)
    }
  }

  // Async checks
  async checkCanGoNext(): Promise<boolean> {
    return this.getState().canGoNext
  }

  checkCanGoPrev(): boolean {
    return this.getState().canGoPrev
  }

  async checkCanGoTo(stepId: string): Promise<boolean> {
    const state = this.getState()
    const step = state.steps.find((s) => s.id === stepId)
    return step?.isActive ?? false
  }

  // ===== DATA MANAGEMENT =====

  getData(): TData
  getData<K extends keyof TData>(field: K): TData[K]
  getData<K extends keyof TData>(fields: K[]): Pick<TData, K>
  getData(fieldOrFields?: any): any {
    const state = this.getState()
    const data = state.data as TData
    if (!fieldOrFields) return data
    if (Array.isArray(fieldOrFields)) {
      const result: any = {}
      fieldOrFields.forEach((f) => {
        result[f] = data[f as keyof TData]
      })
      return result
    }
    return data[fieldOrFields as keyof TData]
  }

  setData(data: Partial<TData>, replace = false): void {
    this.checkDestroyed()

    const changedFields = Object.keys(data)
    const currentState = this.stateManager.getState()

    this.stateManager.setState((s) => ({
      ...s,
      data: replace
        ? ({ ...data } as TData)
        : ({ ...currentState.data, ...data } as TData),
    }))

    // Update step manager data reference
    this.stateManager.getStepManager().updateData(this.data)

    // Emit data change event
    this.eventEmitter.emit('data:change', {
      data: this.data as Record<string, unknown>,
      changedFields,
    })
  }

  setField<K extends keyof TData>(field: K, value: TData[K]): void {
    this.checkDestroyed()
    this.setData({ [field]: value } as unknown as Partial<TData>)
  }

  clearField<K extends keyof TData>(field: K): void {
    this.checkDestroyed()
    const data = this.getData() as any
    // Create new object without the field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [field]: removed, ...rest } = data
    this.setData(rest as Partial<TData>)
  }

  getStepData(_stepId: string): Partial<TData> {
    this.checkDestroyed()
    // Simplified implementation - returns all data
    return this.getData()
  }

  setStepData(_stepId: string, data: Partial<TData>): void {
    this.checkDestroyed()
    this.setData(data)
  }

  resetData(): void {
    this.checkDestroyed()
    this.setData(
      (this.config.initialData as TData) ?? ({} as TData),
      true
    )
  }

  resetStepData(_stepId: string): void {
    this.checkDestroyed()
    // Simplified implementation
  }

  // ===== VALIDATION =====

  async validate(stepId?: string): Promise<ValidationErrors | null> {
    this.checkDestroyed()
    const state = this.getState()
    const targetStepId = stepId ?? state.currentStep.id
    const stepDef = this.stateManager
      .getStepManager()
      .getDefinition(targetStepId)
    const validationEngine = this.stateManager.getValidationEngine()

    if (!stepDef) return null

    this.stateManager.setState((s) => ({ ...s, isValidating: true }))

    const errors = await validationEngine.validateAll(state.data, stepDef)

    this.stateManager.setState((s) => ({ ...s, isValidating: false }))

    if (errors) {
      this.stateManager.getStepManager().setErrors(targetStepId, errors)
      this.eventEmitter.emit('validation:error', {
        step: state.currentStep,
        errors,
      })
    } else {
      this.stateManager.getStepManager().clearErrors(targetStepId)
      this.eventEmitter.emit('validation:success', {
        step: state.currentStep,
      })
    }

    return errors
  }

  async validateAll(): Promise<Record<string, ValidationErrors>> {
    this.checkDestroyed()
    const result: Record<string, ValidationErrors> = {}
    const stepManager = this.stateManager.getStepManager()

    for (const step of stepManager.getActiveSteps()) {
      const errors = await this.validate(step.id)
      if (errors) {
        result[step.id] = errors
      }
    }

    return result
  }

  async isValid(): Promise<boolean> {
    this.checkDestroyed()
    const errors = await this.validate()
    return errors === null
  }

  async isStepValid(_stepId: string): Promise<boolean> {
    this.checkDestroyed()
    // Simplified implementation
    return await this.isValid()
  }

  getErrors(stepId?: string): ValidationErrors {
    if (stepId) {
      const stepManager = this.stateManager.getStepManager()
      return stepManager.getSteps().find((s) => s.id === stepId)?.errors || {}
    }
    return this.getState().errors
  }

  setErrors(errors: ValidationErrors): void {
    this.checkDestroyed()
    const state = this.getState()
    this.stateManager.getStepManager().setErrors(state.currentStep.id, errors)
  }

  clearErrors(stepId?: string): void {
    this.checkDestroyed()
    if (stepId) {
      this.stateManager.getStepManager().clearErrors(stepId)
    } else {
      this.stateManager.getStepManager().clearErrors()
    }
  }

  // ===== STEP QUERIES =====

  getStep(stepId: string): Step | undefined {
    this.checkDestroyed()
    return this.stateManager.getStepManager().findById(stepId)
  }

  getStepByIndex(index: number): Step | undefined {
    this.checkDestroyed()
    return this.stateManager.getStepManager().findByIndex(index)
  }

  isStepVisible(stepId: string): boolean {
    this.checkDestroyed()
    const step = this.getStep(stepId)
    return step?.isActive ?? false
  }

  isStepActive(stepId: string): boolean {
    return this.isStepVisible(stepId)
  }

  isStepCompleted(stepId: string): boolean {
    this.checkDestroyed()
    const state = this.getState()
    const stepIndex = state.activeSteps.findIndex((s) => s.id === stepId)
    return stepIndex >= 0 && stepIndex < state.currentIndex
  }

  isStepDisabled(stepId: string): boolean {
    this.checkDestroyed()
    const step = this.getStep(stepId)
    return step?.isDisabled ?? false
  }

  // ===== HISTORY =====

  getHistory(): string[] {
    return [...this.getState().history]
  }

  canUndo(): boolean {
    return this.getState().history.length > 0
  }

  async undo(): Promise<boolean> {
    this.checkDestroyed()
    const history = this.getState().history
    if (history.length === 0) return false

    const previousStepId = history[history.length - 1]
    if (!previousStepId) return false
    return await this.goTo(previousStepId)
  }

  // ===== PERSISTENCE =====

  persist(): void | Promise<void> {
    this.checkDestroyed()
    if (this.persistenceManager) {
      this.persistenceManager.saveImmediate(this.getState())
    }
  }

  restore(): void | Promise<void> {
    this.checkDestroyed()
    if (!this.persistenceManager) return

    this.persistenceManager.restore().then((restored) => {
      if (restored && restored.data && restored.currentStep && restored.history) {
        // Restore state
        this.stateManager.setState((s) => ({
          ...s,
          data: restored.data as TData,
        }))
        this.stateManager.getStepManager().updateData(restored.data as TData)

        const state = this.getState()
        const activeSteps = state.activeSteps
        const index = activeSteps.findIndex((s) => s.id === restored.currentStep)
        if (index >= 0) {
          this.stateManager.setState((s) => ({
            ...s,
            currentIndex: index,
            history: restored.history ?? [],
          }))
        }

        // Emit restore event
        this.eventEmitter.emit('restore', {
          data: restored.data,
        })
      }
    })
  }

  clearPersisted(): void | Promise<void> {
    this.checkDestroyed()
    if (this.persistenceManager) {
      this.persistenceManager.clear()
    }
  }

  // ===== EVENTS =====

  on<E extends WizardEvent>(
    event: E,
    handler: WizardEventHandler<E>
  ): Unsubscribe {
    this.checkDestroyed()
    return this.eventEmitter.on(event, handler as any)
  }

  off<E extends WizardEvent>(event: E, handler: WizardEventHandler<E>): void {
    this.checkDestroyed()
    this.eventEmitter.off(event, handler as any)
  }

  once<E extends WizardEvent>(
    event: E,
    handler: WizardEventHandler<E>
  ): void {
    this.checkDestroyed()
    this.eventEmitter.once(event, handler as any)
  }

  subscribe(
    handler: (state: WizardState<TData>, prevState: WizardState<TData>) => void
  ): Unsubscribe {
    this.checkDestroyed()
    return this.stateManager.subscribe(handler as any)
  }

  // ===== MIDDLEWARE =====

  use(middleware: WizardMiddleware<TData>): Unsubscribe {
    this.checkDestroyed()
    return this.middlewareManager.use(middleware)
  }

  // ===== ACTION DISPATCH =====

  async dispatch(action: WizardAction): Promise<void> {
    this.checkDestroyed()

    const reducer = (
      state: ReturnType<typeof this.stateManager.getInternalState>,
      action: WizardAction
    ) => {
      // Create a new state based on the action
      const newState = { ...state }

      switch (action.type) {
        case 'SET_DATA':
        case 'MERGE_DATA':
          newState.data = {
            ...state.data,
            ...(action.data as Partial<TData>),
          }
          break
        case 'SET_FIELD':
          newState.data = {
            ...state.data,
            [(action.field as string)]: action.value,
          }
          break
        case 'CLEAR_FIELD':
          const fieldToDelete = action.field as string
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [fieldToDelete]: removed, ...rest } = state.data as any
          newState.data = rest
          break
        case 'RESET':
          newState.currentIndex = 0
          newState.data =
            (this.config.initialData as TData) ?? ({} as TData)
          newState.history = []
          newState.isComplete = false
          newState.errors = new Map()
          break
        default:
          // Navigation actions are handled by the navigation controller
          break
      }

      return newState
    }

    await this.middlewareManager.execute(
      action as any,
      () => this.getState(),
      (action) => {
        const newState = reducer(this.stateManager.getInternalState(), action)
        this.stateManager.setInternalState(newState as any)
      }
    )
  }

  // ===== LIFECYCLE =====

  destroy(): void {
    if (this.destroyed) return

    this.eventEmitter.clear()
    this.middlewareManager.clear()
    this.persistenceManager?.destroy()

    this.destroyed = true
  }
}
