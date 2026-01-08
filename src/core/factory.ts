import type { WizardInstance, WizardConfig } from '../types.js'
import { Wizard } from './wizard.js'

/**
 * Create a wizard instance
 * @param config - Wizard configuration
 * @returns New wizard instance
 */
export function createWizard<TData = Record<string, unknown>>(
  config: WizardConfig<TData>
): WizardInstance<TData> {
  return new Wizard<TData>(config)
}
