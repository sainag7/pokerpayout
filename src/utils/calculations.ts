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

export function formatMoney(amount: number): string {
  return `$${Math.abs(amount).toFixed(2)}`;
}

export function formatMoneyWithSign(amount: number): string {
  if (amount > 0) return `+$${amount.toFixed(2)}`;
  if (amount < 0) return `-$${Math.abs(amount).toFixed(2)}`;
  return '$0.00';
}
