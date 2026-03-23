interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function GoldButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}: GoldButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gold text-felt-black font-semibold rounded-xl px-6 py-3 min-h-[44px]
        transition-all duration-150 cursor-pointer
        enabled:hover:bg-gold-dark enabled:active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed
        gold-glow
        ${className}
      `}
    >
      {children}
    </button>
  );
}
