import type { Player, PlayerResult, ZelleTransaction } from '../types/game';

export function getTotalBuyIn(player: Player): number {
  return player.buyIns.reduce((sum, b) => sum + b, 0);
}

export function getPotTotal(players: Player[]): number {
  return players.reduce((sum, p) => sum + getTotalBuyIn(p), 0);
}

export function getTotalCashout(players: Player[]): number {
  return players.reduce((sum, p) => sum + (p.cashout ?? 0), 0);
}

export function isBalanced(players: Player[]): boolean {
  return Math.abs(getPotTotal(players) - getTotalCashout(players)) < 0.01;
}

export function getPlayerResults(players: Player[]): PlayerResult[] {
  return players
    .map((p) => ({
      id: p.id,
      name: p.name,
      totalBuyIn: getTotalBuyIn(p),
      cashout: p.cashout ?? 0,
      net: (p.cashout ?? 0) - getTotalBuyIn(p),
      isBanker: p.isBanker,
    }))
    .sort((a, b) => b.net - a.net);
}

export function getZelleTransactions(players: Player[]): ZelleTransaction[] {
  const results = getPlayerResults(players);
  const banker = results.find((r) => r.isBanker);
  if (!banker) return [];

  return results
    .filter((r) => !r.isBanker && r.cashout > 0)
    .map((r) => ({
      from: banker.name,
      to: r.name,
      amount: r.cashout,
    }));
}

export function getSimplifiedTransactions(players: Player[]): ZelleTransaction[] {
  const results = getPlayerResults(players);

  // Work in cents to avoid floating-point drift
  const creditors = results
    .filter((r) => r.net > 0.005)
    .map((r) => ({ name: r.name, balance: Math.round(r.net * 100) }))
    .sort((a, b) => b.balance - a.balance);

  const debtors = results
    .filter((r) => r.net < -0.005)
    .map((r) => ({ name: r.name, balance: Math.round(r.net * 100) }))
    .sort((a, b) => a.balance - b.balance);

  const transactions: ZelleTransaction[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const amount = Math.min(creditor.balance, -debtor.balance);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: Math.round(amount) / 100,
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) ci++;
    if (debtor.balance === 0) di++;
  }

  return transactions;
}

export function formatMoney(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

export function formatMoneyWithSign(amount: number): string {
  if (amount > 0) return `+$${amount.toFixed(2)}`;
  if (amount < 0) return `-$${Math.abs(amount).toFixed(2)}`;
  return '$0.00';
}
