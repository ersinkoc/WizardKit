import { useContext, useState, useEffect, useMemo } from 'react'
import type { WizardInstance, WizardState } from '../../../types.js'
import { WizardContext } from '../context.js'

/**
 * Main wizard hook
 * Provides access to the wizard state and methods
 */
export function useWizard<TData = Record<string, unknown>>() {
  const wizard = useContext(WizardContext) as WizardInstance<TData> | null

  if (!wizard) {
    throw new Error('useWizard must be used within a WizardProvider')
  }

  const [, forceUpdate] = useState({})

  // Subscribe to state changes
  useEffect(() => {
    const unsub = wizard.subscribe(() => {
      forceUpdate({})
    })
    return unsub
  }, [wizard])

  // Get current state
  const state = wizard.getState() as WizardState<TData>

  return useMemo(
    () => ({
      // State
      currentStep: state.currentStep,
      currentIndex: state.currentIndex,
      steps: state.steps,
      activeSteps: state.activeSteps,
      data: state.data,
      errors: state.errors,
      history: state.history,
      progress: state.progress,
      progressPercent: state.progressPercent,
      completedSteps: state.completedSteps,
      totalSteps: state.totalSteps,
      isFirst: state.isFirst,
      isLast: state.isLast,
      isComplete: state.isComplete,
      canGoNext: state.canGoNext,
      canGoPrev: state.canGoPrev,
      isLoading: state.isLoading,
      isValidating: state.isValidating,

      // Navigation
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

      // Data
      getData: wizard.getData.bind(wizard),
      setData: wizard.setData.bind(wizard),
      setField: wizard.setField.bind(wizard),
      clearField: wizard.clearField.bind(wizard),
      resetData: wizard.resetData.bind(wizard),

      // Validation
      validate: () => wizard.validate(),
      isValid: () => wizard.isValid(),
      getErrors: wizard.getErrors.bind(wizard),
      setErrors: wizard.setErrors.bind(wizard),
      clearErrors: wizard.clearErrors.bind(wizard),

      // Queries
      getStep: wizard.getStep.bind(wizard),
      isStepVisible: wizard.isStepVisible.bind(wizard),
      isStepActive: wizard.isStepActive.bind(wizard),
      isStepCompleted: wizard.isStepCompleted.bind(wizard),

      // Events
      on: wizard.on.bind(wizard),
      off: wizard.off.bind(wizard),
      once: wizard.once.bind(wizard),

      // Raw instance
      wizard,
    }),
    [state, wizard]
  )
}
