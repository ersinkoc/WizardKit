import { useWizard } from '../hooks/useWizard.js'

export interface WizardProgressProps {
  variant?: 'bar' | 'circle' | 'steps'
  showPercentage?: boolean
  showStepCount?: boolean
  className?: string
  barClassName?: string
  fillClassName?: string
  textClassName?: string
}

/**
 * WizardProgress component
 * Displays the progress of the wizard
 */
export function WizardProgress({
  variant = 'bar',
  showPercentage = true,
  showStepCount = true,
  className = '',
  barClassName = '',
  fillClassName = '',
  textClassName = '',
}: WizardProgressProps = {}): JSX.Element | null {
  const { progress, progressPercent, currentIndex, totalSteps } = useWizard()

  if (variant === 'circle') {
    const size = 80
    const strokeWidth = 6
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - progress * circumference

    return (
      <div className={`wizard-progress wizard-progress-circle ${className}`}>
        <svg width={size} height={size} className="wizard-progress-svg">
          <circle
            className="wizard-progress-circle-bg"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`wizard-progress-circle-fill ${fillClassName}`}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {(showPercentage || showStepCount) && (
          <div className={`wizard-progress-text ${textClassName}`}>
            {showPercentage && `${Math.round(progressPercent)}%`}
            {showPercentage && showStepCount && ' '}
            {showStepCount && `(${currentIndex + 1}/${totalSteps})`}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'steps') {
    return (
      <div className={`wizard-progress wizard-progress-steps ${className}`}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`wizard-progress-step ${fillClassName} ${
              index <= currentIndex ? 'active' : ''
            }`}
          />
        ))}
        {(showPercentage || showStepCount) && (
          <div className={`wizard-progress-text ${textClassName}`}>
            {showPercentage && `${Math.round(progressPercent)}%`}
            {showPercentage && showStepCount && ' '}
            {showStepCount && `(${currentIndex + 1}/${totalSteps})`}
          </div>
        )}
      </div>
    )
  }

  // Default bar variant
  return (
    <div className={`wizard-progress wizard-progress-bar ${className}`}>
      <div className={`wizard-progress-bar-bg ${barClassName}`}>
        <div
          className={`wizard-progress-bar-fill ${fillClassName}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {(showPercentage || showStepCount) && (
        <div className={`wizard-progress-text ${textClassName}`}>
          {showPercentage && `${Math.round(progressPercent)}%`}
          {showPercentage && showStepCount && ' '}
          {showStepCount && `(${currentIndex + 1}/${totalSteps})`}
        </div>
      )}
    </div>
  )
}
