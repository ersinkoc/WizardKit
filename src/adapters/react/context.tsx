import { createContext } from 'react'
import type { WizardInstance } from '../../types.js'

/**
 * React context for wizard instance
 */
export const WizardContext = createContext<WizardInstance | null>(null)

/**
 * Display name for the context
 */
WizardContext.displayName = 'WizardContext'
