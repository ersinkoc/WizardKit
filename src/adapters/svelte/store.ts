import { writable, derived } from 'svelte/store'
import type {
  WizardConfig,
  WizardState,
  Unsubscribe,
} from '../../types.js'
import { createWizard } from '../../core/factory.js'

/**
 * Create a Svelte store for wizard state
 * @param config - Wizard configuration
 * @returns Writable store with wizard state and actions
 */
export function createWizardStore<TData = Record<string, unknown>>(
  config: WizardConfig<TData>
) {
  // Create wizard instance
  const wizard = createWizard<TData>(config)

  // Create a writable store that holds the wizard state
  const { subscribe } = derived(
    writable(wizard),
    ($wizard: typeof wizard) => $wizard.getState() as WizardState<TData>
  )

  // Subscribe to wizard state changes
  const unsub = wizard.subscribe((state) => {
    // Trigger store update (derived stores will update automatically)
    void state
  })

  // Actions that can be called on the store
  return {
    subscribe,

    // Navigation actions
    next: () => wizard.next(),
    prev: () => wizard.prev(),
    goTo: (stepId: string) => wizard.goTo(stepId),
    goToIndex: (index: number) => wizard.goToIndex(index),
    first: () => wizard.first(),
    last: () => wizard.last(),
    skip: () => wizard.skip(),
    reset: () => wizard.reset(),
    complete: () => wizard.complete(),
    cancel: () => wizard.cancel(),

    // Data actions
    getData: () => wizard.getData(),
    setData: (data: Partial<TData>) => wizard.setData(data),
    setField: <K extends keyof TData>(field: K, value: TData[K]) =>
      wizard.setField(field, value),
    clearField: <K extends keyof TData>(field: K) => wizard.clearField(field),
    resetData: () => wizard.resetData(),

    // Validation actions
    validate: () => wizard.validate(),
    isValid: () => wizard.isValid(),
    getErrors: () => wizard.getErrors(),
    setErrors: (errors: Record<string, string>) => wizard.setErrors(errors),
    clearErrors: () => wizard.clearErrors(),

    // Query actions
    getStep: (stepId: string) => wizard.getStep(stepId),
    isStepVisible: (stepId: string) => wizard.isStepVisible(stepId),
    isStepActive: (stepId: string) => wizard.isStepActive(stepId),
    isStepCompleted: (stepId: string) => wizard.isStepCompleted(stepId),
    isStepDisabled: (stepId: string) => wizard.isStepDisabled(stepId),

    // Event actions
    on: <E extends keyof import('../../types.js').WizardEventMap>(
      event: E,
      handler: (payload: import('../../types.js').WizardEventMap[E]) => void
    ) => wizard.on(event as any, handler as any),
    off: <E extends keyof import('../../types.js').WizardEventMap>(
      event: E,
      handler: (payload: import('../../types.js').WizardEventMap[E]) => void
    ) => wizard.off(event as any, handler as any),
    once: <E extends keyof import('../../types.js').WizardEventMap>(
      event: E,
      handler: (payload: import('../../types.js').WizardEventMap[E]) => void
    ) => wizard.once(event as any, handler as any),

    // Destroy
    destroy: () => {
      unsub()
      wizard.destroy()
    },

    // Get raw wizard instance
    getWizard: () => wizard,
  }
}

/**
 * Type for the wizard store
 */
export type WizardStore<TData = Record<string, unknown>> = ReturnType<
  typeof createWizardStore<TData>
> & {
  subscribe: (callback: (state: WizardState<TData>) => void) => Unsubscribe
}
