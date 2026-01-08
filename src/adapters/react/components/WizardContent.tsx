import { useWizard } from '../hooks/useWizard.js'
import type { ReactNode } from 'react'

export interface WizardContentProps {
  components?: Record<string, React.ComponentType>
  render?: (step: { id: string; title: string }) => ReactNode
  transition?: 'slide' | 'fade' | 'none'
  transitionDuration?: number
  className?: string
}

/**
 * WizardContent component
 * Renders the current step's content
 */
export function WizardContent({
  components,
  render,
  transition = 'fade',
  transitionDuration = 300,
  className = '',
}: WizardContentProps): JSX.Element | null {
  const { currentStep } = useWizard()

  const transitionStyle: React.CSSProperties = {
    transition: `opacity ${transitionDuration}ms ease-in-out${
      transition === 'slide'
        ? `, transform ${transitionDuration}ms ease-in-out`
        : ''
    }`,
  }

  const content =
    render?.(currentStep) ||
    (components && components[currentStep.id]
      ? (() => {
          const Component = components[currentStep.id]
          return Component ? <Component /> : null
        })()
      : null)

  return (
    <div
      className={`wizard-content wizard-content-${transition} ${className}`}
      style={transitionStyle}
    >
      {content}
    </div>
  )
}
