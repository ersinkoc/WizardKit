import { useEffect, useMemo } from 'react'
import type { WizardInstance, WizardState } from '../../types.js'
import { WizardContext } from './context.js'

export interface WizardProviderProps<TData = Record<string, unknown>> {
  wizard: WizardInstance<TData>
  children: React.ReactNode
  onComplete?: (data: TData) => void | Promise<void>
  onCancel?: (data: TData, step: WizardState['currentStep']) => void
}

/**
 * Wizard provider component
 * Provides the wizard instance to all child components
 */
export function WizardProvider<TData = Record<string, unknown>>({
  wizard,
  children,
  onComplete,
  onCancel,
}: WizardProviderProps<TData>): JSX.Element {
  // Subscribe to complete event
  useEffect(() => {
    if (onComplete) {
      const unsub = wizard.on('complete', async ({ data }) => {
        await onComplete(data as TData)
      })
      return unsub
    }
    return undefined
  }, [wizard, onComplete])

  // Subscribe to cancel event
  useEffect(() => {
    if (onCancel) {
      const unsub = wizard.on('cancel', ({ data, step }) => {
        onCancel(data as TData, step)
      })
      return unsub
    }
    return undefined
  }, [wizard, onCancel])

  // Memoize the wizard instance to prevent re-renders
  const value = useMemo(() => wizard, [wizard])

  return (
    <WizardContext.Provider value={value as WizardInstance}>
      {children}
    </WizardContext.Provider>
  )
}
