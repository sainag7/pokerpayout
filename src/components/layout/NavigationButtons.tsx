import { GoldButton } from '../shared/GoldButton';
import { SecondaryButton } from '../shared/SecondaryButton';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  backLabel = 'Back',
}: NavigationButtonsProps) {
  return (
    <div className="sticky bottom-0 bg-felt-dark/90 backdrop-blur-sm border-t border-gold/10 px-4 py-4 mt-6 -mx-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex gap-3 max-w-lg mx-auto">
        {onBack && (
          <SecondaryButton onClick={onBack} className="flex-1">
            {backLabel}
          </SecondaryButton>
        )}
        {onNext && (
          <GoldButton
            onClick={onNext}
            disabled={nextDisabled}
            className={onBack ? 'flex-1' : 'w-full'}
          >
            {nextLabel}
          </GoldButton>
        )}
      </div>
    </div>
  );
}
