import type {
  WizardState,
  WizardConfig,
  ValidationErrors,
  NavigationDirection,
} from '../types.js'
import { StepManager } from './step.js'
import { ValidationEngine } from '../validation/validator.js'

/**
 * Internal state structure
 */
interface InternalState<TData> {
  currentIndex: number
  data: TData
  errors: Map<string, ValidationErrors>
  history: string[]
  isComplete: boolean
  isLoading: boolean
  isValidating: boolean
  direction: NavigationDirection | null
}

/**
 * State manager handles wizard state and computed properties
 */
export class StateManager<TData = Record<string, unknown>> {
  private state: InternalState<TData>
  private stepManager: StepManager<TData>
  private validationEngine: ValidationEngine<TData>
  private listeners: Set<
    (state: WizardState<TData>, prevState: WizardState<TData>) => void
  > = new Set()

  constructor(config: WizardConfig<TData>) {
    // Initialize step manager
    this.stepManager = new StepManager<TData>(
      config.steps,
      (config.initialData as TData) ?? ({} as TData)
    )

    // Initialize validation engine
    this.validationEngine = new ValidationEngine<TData>()

    // Initialize internal state
    this.state = {
      currentIndex: this.getInitialIndex(config.initialStep, config.steps),
      data: (config.initialData as TData) ?? ({} as TData),
      errors: new Map(),
      history: [],
      isComplete: false,
      isLoading: false,
      isValidating: false,
      direction: null,
    }
  }

  /**
   * Get initial step index
   */
  private getInitialIndex(
    initialStep: string | number | undefined,
    steps: unknown[]
  ): number {
    if (initialStep === undefined) return 0

    if (typeof initialStep === 'number') {
      return Math.max(0, Math.min(initialStep, steps.length - 1))
    }

    if (typeof initialStep === 'string') {
      const index = steps.findIndex(
        (s) => typeof s === 'object' && s !== null && 'id' in s && s.id === initialStep
      )
      return index >= 0 ? index : 0
    }

    return 0
  }

  /**
   * Get public state with computed properties
   */
  getState(): WizardState<TData> {
    const steps = this.stepManager.getSteps()
    const activeSteps = this.stepManager.getActiveSteps()
    const currentStep = activeSteps[this.state.currentIndex] || steps[0]

    if (!currentStep) {
      // Fallback state if no steps available
      return {
        currentStep: steps[0] || this.createFallbackStep(),
        currentIndex: 0,
        steps,
        activeSteps,
        visibleSteps: this.stepManager.getVisibleSteps(),
        data: this.state.data,
        errors: {},
        history: [...this.state.history],
        isFirst: true,
        isLast: true,
        isComplete: this.state.isComplete,
        canGoNext: false,
        canGoPrev: false,
        progress: 0,
        progressPercent: 0,
        completedSteps: 0,
        totalSteps: activeSteps.length,
        isLoading: this.state.isLoading,
        isValidating: this.state.isValidating,
      }
    }

    const currentStepIndex = activeSteps.indexOf(currentStep)

    // Update step properties
    const updatedSteps = steps.map((step) => ({
      ...step,
      isCurrent: step.id === currentStep.id,
      isCompleted: currentStepIndex >= 0
        ? activeSteps.slice(0, currentStepIndex).some((s) => s.id === step.id)
        : false,
    }))

    const currentStepErrors = this.state.errors.get(currentStep.id) || {}

    const updatedCurrentStep = {
      ...currentStep,
      isCurrent: true,
      isCompleted: false,
      errors: currentStepErrors,
      hasError: Object.keys(currentStepErrors).length > 0,
    }

    return {
      currentStep: updatedCurrentStep,
      currentIndex: this.state.currentIndex,
      steps: updatedSteps,
      activeSteps: activeSteps.map((s) => ({
        ...s,
        isCurrent: s.id === currentStep.id,
        isCompleted: currentStepIndex >= 0
          ? activeSteps.slice(0, currentStepIndex).some((step) => step.id === s.id)
          : false,
      })),
      visibleSteps: this.stepManager.getVisibleSteps(),
      data: this.state.data,
      errors: currentStepErrors,
      history: [...this.state.history],
      isFirst: this.state.currentIndex === 0,
      isLast: this.state.currentIndex === activeSteps.length - 1,
      isComplete: this.state.isComplete,
      canGoNext: this.calculateCanGoNext(activeSteps.length),
      canGoPrev: this.state.currentIndex > 0,
      progress: this.calculateProgress(activeSteps.length),
      progressPercent: this.calculateProgress(activeSteps.length) * 100,
      completedSteps: this.state.currentIndex,
      totalSteps: activeSteps.length,
      isLoading: this.state.isLoading,
      isValidating: this.state.isValidating,
    }
  }

  /**
   * Create a fallback step
   */
  private createFallbackStep() {
    return {
      id: 'fallback',
      index: 0,
      title: 'Unknown Step',
      isActive: false,
      isCompleted: false,
      isCurrent: false,
      isUpcoming: false,
      isDisabled: false,
      canSkip: false,
      hasError: false,
      errors: {},
    }
  }

  /**
   * Immutable state update
   */
  setState(
    updater: (state: InternalState<TData>) => InternalState<TData>
  ): void {
    const prevState = this.getState()
    this.state = updater(this.state)
    const newState = this.getState()

    // Notify subscribers if state changed
    if (prevState !== newState) {
      this.notifyListeners(newState, prevState)
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(
    handler: (state: WizardState<TData>, prevState: WizardState<TData>) => void
  ): () => void {
    this.listeners.add(handler)

    // Return unsubscribe function
    return () => {
      this.listeners.delete(handler)
    }
  }

  /**
   * Notify all subscribers
   */
  private notifyListeners(
    state: WizardState<TData>,
    prevState: WizardState<TData>
  ): void {
    this.listeners.forEach((fn) => {
      try {
        fn(state, prevState)
      } catch (error) {
        console.error('Error in state subscriber:', error)
      }
    })
  }

  /**
   * Calculate progress (0-1)
   */
  private calculateProgress(totalSteps: number): number {
    if (totalSteps === 0) return 0
    return this.state.currentIndex / totalSteps
  }

  /**
   * Calculate if can go next
   */
  private calculateCanGoNext(totalSteps: number): boolean {
    return this.state.currentIndex < totalSteps - 1 && !this.state.isComplete
  }

  /**
   * Get step manager
   */
  getStepManager(): StepManager<TData> {
    return this.stepManager
  }

  /**
   * Get validation engine
   */
  getValidationEngine(): ValidationEngine<TData> {
    return this.validationEngine
  }

  /**
   * Get internal state (for middleware)
   */
  getInternalState(): InternalState<TData> {
    return this.state
  }

  /**
   * Set internal state (for middleware)
   */
  setInternalState(state: InternalState<TData>): void {
    this.state = state
  }
}

/**
 * Create a state manager
 * @param config - Wizard configuration
 * @returns New StateManager instance
 */
export function createStateManager<
  TData = Record<string, unknown>
>(config: WizardConfig<TData>): StateManager<TData> {
  return new StateManager<TData>(config)
}
