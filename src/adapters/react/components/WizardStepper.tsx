import { useMemo } from 'react'
import type { WizardInstance, Step } from '../../../types.js'
import { useWizard } from '../hooks/useWizard.js'

export interface WizardStepperProps {
  wizard?: WizardInstance
  variant?: 'horizontal' | 'vertical' | 'dots' | 'progress'
  showNumbers?: boolean
  showTitles?: boolean
  showDescriptions?: boolean
  clickable?: boolean
  className?: string
  stepClassName?: string
  activeClassName?: string
  completedClassName?: string
  disabledClassName?: string
  renderStep?: (step: Step, state: WizardStepState) => React.ReactNode
}

export interface WizardStepState {
  isCurrent: boolean
  isCompleted: boolean
  isUpcoming: boolean
  isDisabled: boolean
  index: number
}

/**
 * WizardStepper component
 * Displays the step indicator
 */
export function WizardStepper({
  variant = 'horizontal',
  showNumbers = true,
  showTitles = true,
  showDescriptions = false,
  clickable = true,
  className = '',
  stepClassName = '',
  activeClassName = 'active',
  completedClassName = 'completed',
  disabledClassName = 'disabled',
  renderStep,
}: WizardStepperProps = {}): JSX.Element | null {
  const { activeSteps, currentIndex, goTo } = useWizard()

  const steps = useMemo(() => {
    return activeSteps.map((step, index) => ({
      ...step,
      isCurrent: index === currentIndex,
      isCompleted: index < currentIndex,
      isUpcoming: index > currentIndex,
      isDisabled: step.isDisabled,
      index,
    }))
  }, [activeSteps, currentIndex])

  if (variant === 'dots') {
    return (
      <div className={`wizard-stepper wizard-stepper-dots ${className}`}>
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => clickable && goTo(step.id)}
            disabled={!clickable || step.isDisabled}
            className={`wizard-step-dot ${stepClassName} ${
              step.isCurrent ? activeClassName : ''
            } ${step.isCompleted ? completedClassName : ''} ${
              step.isDisabled ? disabledClassName : ''
            }`}
            aria-label={step.title}
            aria-current={step.isCurrent ? 'step' : undefined}
          />
        ))}
      </div>
    )
  }

  if (variant === 'vertical') {
    return (
      <div className={`wizard-stepper wizard-stepper-vertical ${className}`}>
        {steps.map((step) =>
          renderStep ? (
            renderStep(step, {
              isCurrent: step.isCurrent,
              isCompleted: step.isCompleted,
              isUpcoming: step.isUpcoming,
              isDisabled: step.isDisabled,
              index: step.index,
            })
          ) : (
            <button
              key={step.id}
              type="button"
              onClick={() => clickable && goTo(step.id)}
              disabled={!clickable || step.isDisabled}
              className={`wizard-step-vertical ${stepClassName} ${
                step.isCurrent ? activeClassName : ''
              } ${step.isCompleted ? completedClassName : ''} ${
                step.isDisabled ? disabledClassName : ''
              }`}
            >
              {showNumbers && (
                <span className="wizard-step-number">{step.index + 1}</span>
              )}
              <div className="wizard-step-content">
                {showTitles && (
                  <span className="wizard-step-title">{step.title}</span>
                )}
                {showDescriptions && step.description && (
                  <span className="wizard-step-description">
                    {step.description}
                  </span>
                )}
              </div>
            </button>
          )
        )}
      </div>
    )
  }

  if (variant === 'progress') {
    return (
      <div className={`wizard-stepper wizard-stepper-progress ${className}`}>
        <div className="wizard-progress-bar">
          <div
            className="wizard-progress-fill"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="wizard-progress-text">
          Step {currentIndex + 1} of {steps.length}
        </div>
      </div>
    )
  }

  // Default horizontal variant
  return (
    <div className={`wizard-stepper wizard-stepper-horizontal ${className}`}>
      {steps.map((step, index) =>
        renderStep ? (
          renderStep(step, {
            isCurrent: step.isCurrent,
            isCompleted: step.isCompleted,
            isUpcoming: step.isUpcoming,
            isDisabled: step.isDisabled,
            index: step.index,
          })
        ) : (
          <div
            key={step.id}
            className={`wizard-step-horizontal ${stepClassName} ${
              step.isCurrent ? activeClassName : ''
            } ${step.isCompleted ? completedClassName : ''} ${
              step.isDisabled ? disabledClassName : ''
            }`}
          >
            <button
              type="button"
              onClick={() => clickable && goTo(step.id)}
              disabled={!clickable || step.isDisabled}
              className="wizard-step-button"
              aria-current={step.isCurrent ? 'step' : undefined}
            >
              {showNumbers && (
                <span className="wizard-step-number">{step.index + 1}</span>
              )}
              {showTitles && (
                <span className="wizard-step-title">{step.title}</span>
              )}
              {showDescriptions && step.description && (
                <span className="wizard-step-description">
                  {step.description}
                </span>
              )}
            </button>
            {index < steps.length - 1 && (
              <div className="wizard-step-connector" />
            )}
          </div>
        )
      )}
    </div>
  )
}
