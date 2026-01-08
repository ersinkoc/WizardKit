import type {
  Step,
  NavigationDirection,
  BeforeLeaveResult,
} from '../types.js'
import type { StateManager } from './state.js'
import type { EventEmitter } from '../events/emitter.js'
import type { WizardEventMap } from '../types.js'

/**
 * Navigation controller handles all navigation operations
 */
export class NavigationController<TData = Record<string, unknown>> {
  private stateManager: StateManager<TData>
  private eventEmitter: EventEmitter<WizardEventMap>
  private config: {
    linear?: boolean
    validateOnNext?: boolean
    validateOnPrev?: boolean
  }

  constructor(
    stateManager: StateManager<TData>,
    eventEmitter: EventEmitter<WizardEventMap>,
    config: {
      linear?: boolean
      validateOnNext?: boolean
      validateOnPrev?: boolean
    }
  ) {
    this.stateManager = stateManager
    this.eventEmitter = eventEmitter
    this.config = config
  }

  /**
   * Navigate to the next step
   */
  async next(): Promise<boolean> {
    const state = this.stateManager.getState()

    // Check if can go next
    if (state.isLast) {
      return await this.complete()
    }

    // Validate current step if needed
    if (this.config.validateOnNext !== false) {
      const errors = await this.validateCurrentStep()
      if (errors) {
        this.eventEmitter.emit('validation:error', {
          step: state.currentStep,
          errors,
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

  /**
   * Navigate to the previous step
   */
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

  /**
   * Navigate to a specific step by ID
   */
  async goTo(stepId: string): Promise<boolean> {
    const state = this.stateManager.getState()
    const targetStep = state.steps.find((s) => s.id === stepId)

    if (!targetStep || !targetStep.isActive) {
      return false
    }

    // Check if linear mode
    if (this.config.linear && !this.isReachable(stepId, state)) {
      return false
    }

    return await this.goToStep(targetStep, 'jump')
  }

  /**
   * Navigate to a specific step by index
   */
  async goToIndex(index: number): Promise<boolean> {
    const state = this.stateManager.getState()
    const activeSteps = state.activeSteps

    if (index < 0 || index >= activeSteps.length) {
      return false
    }

    const targetStep = activeSteps[index]
    if (!targetStep) return false

    return await this.goTo(targetStep.id)
  }

  /**
   * Navigate to the first step
   */
  async first(): Promise<boolean> {
    return await this.goToIndex(0)
  }

  /**
   * Navigate to the last step
   */
  async last(): Promise<boolean> {
    const state = this.stateManager.getState()
    return await this.goToIndex(state.activeSteps.length - 1)
  }

  /**
   * Skip the current step
   */
  async skip(): Promise<boolean> {
    const state = this.stateManager.getState()

    if (!state.currentStep.canSkip) {
      return false
    }

    return await this.next()
  }

  /**
   * Complete the wizard
   */
  async complete(): Promise<boolean> {
    const state = this.stateManager.getState()

    // Validate current step
    const errors = await this.validateCurrentStep()
    if (errors) {
      this.eventEmitter.emit('validation:error', {
        step: state.currentStep,
        errors,
      })
      return false
    }

    // Mark as complete
    this.stateManager.setState((s) => ({
      ...s,
      isComplete: true,
    }))

    // Emit complete event
    this.eventEmitter.emit('complete', { data: state.data as Record<string, unknown> })

    return true
  }

  /**
   * Navigate to a step
   */
  private async goToStep(
    targetStep: Step,
    direction: NavigationDirection
  ): Promise<boolean> {
    const state = this.stateManager.getState()
    const stepManager = this.stateManager.getStepManager()
    const currentStepDef = stepManager.getDefinition(state.currentStep.id)
    const targetStepDef = stepManager.getDefinition(targetStep.id)

    if (!targetStepDef) return false

    // beforeLeave hook
    if (currentStepDef?.beforeLeave) {
      const result = await this.executeBeforeLeaveHook(
        currentStepDef.beforeLeave,
        direction
      )
      if (result?.block) {
        return false
      }
    }

    // beforeEnter hook
    if (targetStepDef.beforeEnter) {
      const canEnter = await this.executeBeforeEnterHook(
        targetStepDef.beforeEnter
      )
      if (!canEnter) {
        return false
      }
    }

    // Update state
    const prevStep = state.currentStep

    // Find the new index in active steps
    const activeSteps = state.activeSteps
    const newIndex = activeSteps.findIndex((s) => s.id === targetStep.id)

    // Update history based on direction
    let newHistory = [...state.history]
    if (direction === 'prev' && newHistory.length > 0) {
      // Remove last step from history when going back
      newHistory.pop()
    } else if (direction !== 'prev') {
      // Add current step to history when going forward or jumping
      newHistory.push(state.currentStep.id)
    }

    this.stateManager.setState((s) => ({
      ...s,
      currentIndex: newIndex,
      direction,
      history: newHistory,
    }))

    // Emit events
    this.eventEmitter.emit('step:leave', { step: prevStep, direction })
    this.eventEmitter.emit('step:enter', { step: targetStep, direction })
    this.eventEmitter.emit('step:change', {
      step: targetStep,
      direction,
      prevStep,
    })

    // onLeave hook
    if (currentStepDef?.onLeave) {
      this.executeOnLeaveHook(currentStepDef.onLeave, direction)
    }

    // onEnter hook
    if (targetStepDef.onEnter) {
      this.executeOnEnterHook(targetStepDef.onEnter, direction)
    }

    return true
  }

  /**
   * Calculate the next step
   */
  private calculateNextStep(state: {
    currentStep: Step
    data: TData
    activeSteps: Step[]
    steps: Step[]
  }): Step | null {
    const stepManager = this.stateManager.getStepManager()
    const currentStepDef = stepManager.getDefinition(state.currentStep.id)

    // Check for branches
    if (currentStepDef?.branches) {
      for (const branch of Object.values(currentStepDef.branches)) {
        if (branch.condition(state.data)) {
          const nextStep = state.steps.find((s) => s.id === branch.nextStep)
          if (nextStep && nextStep.isActive) {
            return nextStep
          }
        }
      }
    }

    // Use nextStep function
    if (currentStepDef?.nextStep) {
      const nextId =
        typeof currentStepDef.nextStep === 'function'
          ? currentStepDef.nextStep(state.data)
          : currentStepDef.nextStep
      const nextStep = state.steps.find((s) => s.id === nextId)
      if (nextStep && nextStep.isActive) {
        return nextStep
      }
    }

    // Default: next active step
    const activeSteps = state.activeSteps
    const currentIndex = activeSteps.findIndex(
      (s) => s.id === state.currentStep.id
    )
    return activeSteps[currentIndex + 1] || null
  }

  /**
   * Calculate the previous step
   */
  private calculatePrevStep(state: {
    currentStep: Step
    data: TData
    steps: Step[]
    history: string[]
  }): Step | null {
    const stepManager = this.stateManager.getStepManager()
    const currentStepDef = stepManager.getDefinition(state.currentStep.id)

    // Use prevStep function
    if (currentStepDef?.prevStep) {
      const prevId =
        typeof currentStepDef.prevStep === 'function'
          ? currentStepDef.prevStep(state.data)
          : currentStepDef.prevStep
      const prevStep = state.steps.find((s) => s.id === prevId)
      if (prevStep && prevStep.isActive) {
        return prevStep
      }
    }

    // Default: previous in history or previous active step
    if (state.history.length > 0) {
      const prevId = state.history[state.history.length - 1]
      const prevStep = state.steps.find((s) => s.id === prevId)
      if (prevStep && prevStep.isActive) {
        return prevStep
      }
    }

    const activeSteps = this.stateManager.getState().activeSteps
    const currentIndex = activeSteps.findIndex(
      (s) => s.id === state.currentStep.id
    )
    const prevStep = currentIndex > 0 ? activeSteps[currentIndex - 1] : null
    return prevStep ?? null
  }

  /**
   * Check if a step is reachable (in linear mode)
   */
  private isReachable(
    stepId: string,
    state: { activeSteps: Step[]; history: string[] }
  ): boolean {
    // A step is reachable if it's in the history or is the next step
    return (
      state.history.includes(stepId) ||
      state.activeSteps[state.activeSteps.findIndex((s) => s.id === stepId) - 1]
        ?.isCurrent ||
      false
    )
  }

  /**
   * Validate the current step
   */
  private async validateCurrentStep(): Promise<
    Record<string, string> | null
  > {
    const state = this.stateManager.getState()
    const stepManager = this.stateManager.getStepManager()
    const stepDef = stepManager.getDefinition(state.currentStep.id)
    const validationEngine = this.stateManager.getValidationEngine()

    if (!stepDef) return null

    this.stateManager.setState((s) => ({ ...s, isValidating: true }))

    const errors = await validationEngine.validateAll(state.data, stepDef)

    this.stateManager.setState((s) => ({ ...s, isValidating: false }))

    if (errors) {
      stepManager.setErrors(state.currentStep.id, errors)
    } else {
      stepManager.clearErrors(state.currentStep.id)
      this.eventEmitter.emit('validation:success', {
        step: state.currentStep,
      })
    }

    return errors
  }

  /**
   * Execute beforeLeave hook
   */
  private async executeBeforeLeaveHook(
    hook: (
      data: TData,
      wizard: any,
      direction: NavigationDirection
    ) => BeforeLeaveResult | Promise<BeforeLeaveResult>,
    direction: NavigationDirection
  ): Promise<BeforeLeaveResult | undefined> {
    const state = this.stateManager.getState()
    try {
      return await hook(state.data, this.createWizardProxy(), direction)
    } catch {
      return { block: true }
    }
  }

  /**
   * Execute beforeEnter hook
   */
  private async executeBeforeEnterHook(
    hook: (data: TData, wizard: any) => boolean | Promise<boolean>
  ): Promise<boolean> {
    const state = this.stateManager.getState()
    try {
      return await hook(state.data, this.createWizardProxy())
    } catch {
      return false
    }
  }

  /**
   * Execute onLeave hook
   */
  private executeOnLeaveHook(
    hook: (
      data: TData,
      wizard: any,
      direction: NavigationDirection
    ) => void,
    direction: NavigationDirection
  ): void {
    const state = this.stateManager.getState()
    try {
      hook(state.data, this.createWizardProxy(), direction)
    } catch {
      // Silently fail
    }
  }

  /**
   * Execute onEnter hook
   */
  private executeOnEnterHook(
    hook: (
      data: TData,
      wizard: any,
      direction: NavigationDirection
    ) => void,
    direction: NavigationDirection
  ): void {
    const state = this.stateManager.getState()
    try {
      hook(state.data, this.createWizardProxy(), direction)
    } catch {
      // Silently fail
    }
  }

  /**
   * Create a wizard proxy for hooks
   * This is a minimal proxy to avoid circular dependencies
   */
  private createWizardProxy(): any {
    const state = this.stateManager.getState()

    return {
      getState: () => state,
      getData: () => state.data,
      setData: (data: Partial<TData>) => {
        this.stateManager.setState((s) => ({
          ...s,
          data: { ...s.data, ...data } as TData,
        }))
      },
    }
  }
}
