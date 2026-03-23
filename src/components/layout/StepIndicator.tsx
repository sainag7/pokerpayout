const STEPS = ['Setup', 'Play', 'Cashout', 'Results'] as const;

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  onStepClick: (step: 1 | 2 | 3 | 4) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="px-6 pb-6" aria-label="Game progress">
      <div className="flex items-center justify-between max-w-xs mx-auto">
        {STEPS.map((label, i) => {
          const stepNum = (i + 1) as 1 | 2 | 3 | 4;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isClickable = stepNum <= currentStep;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepNum)}
                disabled={!isClickable}
                className={`
                  flex flex-col items-center gap-1 cursor-pointer disabled:cursor-default
                  transition-all duration-150 group
                `}
                aria-label={`Step ${stepNum}: ${label}${isCurrent ? ' (current)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-200
                    ${isCurrent
                      ? 'bg-gold text-felt-black gold-glow-sm'
                      : isCompleted
                        ? 'bg-gold/80 text-felt-black group-hover:bg-gold'
                        : 'bg-surface border border-gold/20 text-text-secondary'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`text-[10px] ${
                    isCurrent ? 'text-gold font-medium' : isCompleted ? 'text-text-secondary' : 'text-text-secondary/50'
                  }`}
                >
                  {label}
                </span>
              </button>

              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mt-[-16px] rounded-full transition-colors duration-200 ${
                    stepNum < currentStep ? 'bg-gold/60' : 'bg-surface-light'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
