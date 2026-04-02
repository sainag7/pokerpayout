import { useState } from 'react';
import { GoldButton } from '../shared/GoldButton';
import { SecondaryButton } from '../shared/SecondaryButton';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
  onReset?: () => void;
}

export function NavigationButtons({
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  backLabel = 'Back',
  onReset,
}: NavigationButtonsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <>
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
          {onReset && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-loss font-semibold border border-loss/50 hover:border-loss hover:bg-loss/10
                rounded-lg px-3 py-2 transition-colors cursor-pointer shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Game"
        message="Are you sure you want to fully reset? All game data will be lost."
        confirmLabel="Yes, Reset"
        onConfirm={() => {
          setShowResetConfirm(false);
          onReset?.();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
