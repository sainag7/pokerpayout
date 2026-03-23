export function validatePlayerName(
  name: string,
  existingNames: string[]
): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Name is required';
  if (trimmed.length > 20) return 'Name must be 20 characters or less';
  if (
    existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())
  ) {
    return 'Player name already exists';
  }
  return null;
}

export function validateBuyIn(amount: string): string | null {
  const num = parseFloat(amount);
  if (amount.trim() === '' || isNaN(num)) return 'Amount is required';
  if (num <= 0) return 'Amount must be positive';
  if (num > 100000) return 'Amount seems too high';
  return null;
}

export function validateCashout(amount: string): string | null {
  const num = parseFloat(amount);
  if (amount.trim() === '' || isNaN(num)) return 'Amount is required';
  if (num < 0) return 'Amount cannot be negative';
  return null;
}
