import { useState } from 'react';

interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string | null;
  label?: string;
  id?: string;
  autoFocus?: boolean;
}

export function MoneyInput({
  value,
  onChange,
  onBlur,
  placeholder = '0.00',
  error,
  label,
  id,
  autoFocus = false,
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm text-text-secondary">
          {label}
        </label>
      )}
      <div
        className={`
          flex items-center gap-1 rounded-lg border px-3 py-2.5
          bg-felt-black transition-colors duration-150
          ${focused ? 'border-gold' : error ? 'border-loss/50' : 'border-gold/30'}
        `}
      >
        <span className="text-text-secondary text-lg">$</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="
            flex-1 bg-transparent text-lg text-text-primary
            placeholder:text-text-secondary/40 outline-none min-w-0
          "
        />
      </div>
      {error && <p className="text-xs text-loss mt-0.5">{error}</p>}
    </div>
  );
}
