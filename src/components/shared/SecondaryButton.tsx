interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-surface text-text-secondary font-medium rounded-xl px-6 py-3 min-h-[44px]
        border border-gold/20 transition-all duration-150 cursor-pointer
        enabled:hover:bg-surface-light enabled:hover:text-text-primary enabled:active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
