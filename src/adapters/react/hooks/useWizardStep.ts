import { useContext, useState, useEffect, useMemo } from 'react'
import type { WizardInstance } from '../../../types.js'
import { WizardContext } from '../context.js'

/**
 * Wizard step hook
 * Provides step-specific state and methods
 */
export function useWizardStep<TData = Record<string, unknown>>(
  stepId: string
) {
  const wizard = useContext(WizardContext) as WizardInstance<TData> | null

  if (!wizard) {
    throw new Error('useWizardStep must be used within a WizardProvider')
  }

  const [, forceUpdate] = useState({})

  // Subscribe to state changes
  useEffect(() => {
    const unsub = wizard.subscribe(() => {
      forceUpdate({})
    })
    return unsub
  }, [wizard])

  const state = wizard.getState()
  const step = state.steps.find((s) => s.id === stepId)
  const stepErrors = wizard.getErrors(stepId)
  const isCurrent = state.currentStep.id === stepId
  const isCompleted = wizard.isStepCompleted(stepId)

  return useMemo(
    () => ({
      // Step state
      step,
      isActive: step?.isActive ?? false,
      isCurrent,
      isCompleted,
      isUpcoming: !isCurrent && !isCompleted,
      isDisabled: step?.isDisabled ?? false,
      canSkip: step?.canSkip ?? false,
      hasError: step?.hasError ?? false,
      errors: stepErrors,

      // Data
      data: state.data,

      // Methods
      setField: wizard.setField.bind(wizard),
      validate: () => wizard.validate(stepId),
      isValid: () => wizard.isStepValid(stepId),
    }),
    [step, stepErrors, isCurrent, isCompleted, state, wizard, stepId]
  )
}
