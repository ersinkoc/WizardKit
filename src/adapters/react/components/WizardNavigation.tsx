import { useWizard } from '../hooks/useWizard.js'

export interface WizardNavigationProps {
  prevLabel?: string
  nextLabel?: string
  completeLabel?: string
  skipLabel?: string
  cancelLabel?: string
  showSkip?: boolean
  showCancel?: boolean
  showProgress?: boolean
  className?: string
  prevClassName?: string
  nextClassName?: string
  cancelClassName?: string
  skipClassName?: string
  renderPrev?: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => React.ReactNode
  renderNext?: (
    props: React.ButtonHTMLAttributes<HTMLButtonElement>,
    state: { isLast: boolean; isLoading: boolean }
  ) => React.ReactNode
  renderSkip?: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => React.ReactNode
  renderCancel?: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => React.ReactNode
}

/**
 * WizardNavigation component
 * Displays navigation buttons for the wizard
 */
export function WizardNavigation({
  prevLabel = '← Previous',
  nextLabel = 'Next →',
  completeLabel = 'Complete',
  skipLabel = 'Skip',
  cancelLabel = 'Cancel',
  showSkip: showSkipProp = false,
  showCancel = false,
  showProgress = false,
  className = '',
  prevClassName = '',
  nextClassName = '',
  cancelClassName = '',
  skipClassName = '',
  renderPrev,
  renderNext,
  renderSkip,
  renderCancel,
}: WizardNavigationProps = {}): JSX.Element | null {
  const {
    isFirst,
    isLast,
    isLoading,
    canGoNext,
    canGoPrev,
    currentStep,
    progressPercent,
    prev,
    next,
    skip,
    cancel,
  } = useWizard()

  const showSkip = showSkipProp || currentStep.canSkip

  const prevButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    onClick: () => prev(),
    disabled: isFirst || !canGoPrev || isLoading,
    className: `wizard-button wizard-button-prev ${prevClassName}`,
    children: prevLabel,
  }

  const nextButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    onClick: () => next(),
    disabled: !canGoNext || isLoading,
    className: `wizard-button wizard-button-next ${nextClassName}`,
    children: isLoading
      ? 'Loading...'
      : isLast
        ? completeLabel
        : nextLabel,
  }

  const skipButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    onClick: () => skip(),
    disabled: isLoading,
    className: `wizard-button wizard-button-skip ${skipClassName}`,
    children: skipLabel,
  }

  const cancelButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'button',
    onClick: () => cancel(),
    disabled: isLoading,
    className: `wizard-button wizard-button-cancel ${cancelClassName}`,
    children: cancelLabel,
  }

  return (
    <div className={`wizard-navigation ${className}`}>
      {showProgress && (
        <div className="wizard-progress-text">
          {Math.round(progressPercent)}% complete
        </div>
      )}

      <div className="wizard-buttons">
        {showCancel &&
          (renderCancel ? (
            renderCancel(cancelButtonProps)
          ) : (
            <button {...cancelButtonProps} />
          ))}

        <div className="wizard-buttons-left">
          {renderPrev ? (
            renderPrev(prevButtonProps)
          ) : (
            <button {...prevButtonProps} />
          )}

          {showSkip &&
            (renderSkip ? (
              renderSkip(skipButtonProps)
            ) : (
              <button {...skipButtonProps} />
            ))}
        </div>

        {renderNext ? (
          renderNext(nextButtonProps, { isLast, isLoading })
        ) : (
          <button {...nextButtonProps} />
        )}
      </div>
    </div>
  )
}
