import type {
  Step,
  StepDefinition,
  WizardContext,
  ValidationErrors,
} from '../types.js'

/**
 * Step manager handles step definitions and computed step properties
 */
export class StepManager<TData = Record<string, unknown>> {
  private definitions: StepDefinition<TData>[]
  private data: TData
  private errors: Map<string, ValidationErrors>
  private cachedSteps: Step[] | null = null

  constructor(
    definitions: StepDefinition<TData>[],
    initialData: TData
  ) {
    this.definitions = definitions
    this.data = initialData
    this.errors = new Map()
  }

  /**
   * Invalidate cached steps
   */
  private invalidateCache(): void {
    this.cachedSteps = null
  }

  /**
   * Get all steps with computed properties
   */
  getSteps(): Step[] {
    if (!this.cachedSteps) {
      this.cachedSteps = this.definitions.map((def, index) => this.createStep(def, index))
    }
    return this.cachedSteps
  }

  /**
   * Get active steps (steps that pass their conditions)
   */
  getActiveSteps(): Step[] {
    return this.getSteps().filter((step) => step.isActive)
  }

  /**
   * Get visible steps (for UI display)
   */
  getVisibleSteps(): Step[] {
    return this.getActiveSteps()
  }

  /**
   * Create a step object with computed properties
   */
  private createStep(definition: StepDefinition<TData>, index: number): Step {
    const context = this.createContext()
    const isActive = this.isStepActive(definition, context)
    const isDisabled = this.isStepDisabled(definition)
    const canSkip = this.canStepSkip(definition)
    const errors = this.errors.get(definition.id) || {}

    return {
      id: definition.id,
      index,
      title: definition.title,
      description: definition.description,
      icon: definition.icon,
      meta: definition.meta,
      isActive,
      isCompleted: false, // Will be set by state manager
      isCurrent: false, // Will be set by state manager
      isUpcoming: !isActive,
      isDisabled,
      canSkip,
      hasError: Object.keys(errors).length > 0,
      errors,
    }
  }

  /**
   * Create wizard context for condition evaluation
   */
  private createContext(): WizardContext {
    // Create a minimal fallback step to avoid circular dependency
    const fallbackStep: Step = {
      id: '',
      index: 0,
      title: '',
      isActive: false,
      isCompleted: false,
      isCurrent: false,
      isUpcoming: false,
      isDisabled: false,
      canSkip: false,
      hasError: false,
      errors: {},
    }

    // We'll return a minimal context here
    // The full context will be provided by the wizard class
    return {
      currentStep: fallbackStep,
      history: [],
      direction: null,
    }
  }

  /**
   * Check if a step is active (passes its conditions)
   */
  private isStepActive(
    definition: StepDefinition<TData>,
    context: WizardContext
  ): boolean {
    // Check single condition
    if (definition.condition && !definition.condition(this.data, context)) {
      return false
    }

    // Check multiple conditions (AND logic)
    if (definition.conditions) {
      return definition.conditions.every((condition) =>
        condition(this.data, context)
      )
    }

    return true
  }

  /**
   * Check if a step is disabled
   */
  private isStepDisabled(definition: StepDefinition<TData>): boolean {
    if (typeof definition.disabled === 'boolean') {
      return definition.disabled
    }
    if (typeof definition.disabled === 'function') {
      return definition.disabled(this.data)
    }
    return false
  }

  /**
   * Check if a step can be skipped
   */
  private canStepSkip(definition: StepDefinition<TData>): boolean {
    if (typeof definition.canSkip === 'boolean') {
      return definition.canSkip
    }
    if (typeof definition.canSkip === 'function') {
      return definition.canSkip(this.data)
    }
    return false
  }

  /**
   * Find step by ID
   */
  findById(id: string): Step | undefined {
    return this.getSteps().find((s) => s.id === id)
  }

  /**
   * Find step by index
   */
  findByIndex(index: number): Step | undefined {
    return this.getSteps()[index]
  }

  /**
   * Find active step by index
   */
  findActiveByIndex(index: number): Step | undefined {
    return this.getActiveSteps()[index]
  }

  /**
   * Update data reference and recompute steps
   */
  updateData(data: TData): void {
    this.data = data
    this.invalidateCache()
  }

  /**
   * Set errors for a step
   */
  setErrors(stepId: string, errors: ValidationErrors): void {
    if (Object.keys(errors).length > 0) {
      this.errors.set(stepId, errors)
    } else {
      this.errors.delete(stepId)
    }
    this.invalidateCache()
  }

  /**
   * Clear errors for a step
   */
  clearErrors(stepId?: string): void {
    if (stepId) {
      this.errors.delete(stepId)
    } else {
      this.errors.clear()
    }
    this.invalidateCache()
  }

  /**
   * Get step definition by ID
   */
  getDefinition(id: string): StepDefinition<TData> | undefined {
    return this.definitions.find((d) => d.id === id)
  }

  /**
   * Get all step definitions
   */
  getDefinitions(): StepDefinition<TData>[] {
    return this.definitions
  }

  /**
   * Get current data
   */
  getData(): TData {
    return this.data
  }
}

/**
 * Create a step manager
 * @param definitions - Step definitions
 * @param initialData - Initial data
 * @returns New StepManager instance
 */
export function createStepManager<TData = Record<string, unknown>>(
  definitions: StepDefinition<TData>[],
  initialData: TData
): StepManager<TData> {
  return new StepManager<TData>(definitions, initialData)
}
