import { useState } from 'react';
import type { GameState } from '../../types/game';
import type { GameAction } from '../../state/gameReducer';
import {
  getPlayerResults,
  getZelleTransactions,
  isBalanced,
  formatMoneyWithSign,
  getPotTotal,
  getTotalCashout,
} from '../../utils/calculations';
import { WarningBanner } from '../shared/WarningBanner';
import { GoldButton } from '../shared/GoldButton';
import { SecondaryButton } from '../shared/SecondaryButton';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface ResultsProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onBack: () => void;
  onNewGame: () => void;
}

const RANK_STYLES = [
  'border-gold/40 bg-gold/5',
  'border-gold/25',
  'border-gold/15',
];

export function Results({ state, onBack, onNewGame }: ResultsProps) {
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const results = getPlayerResults(state.players);
  const transactions = getZelleTransactions(state.players);
  const balanced = isBalanced(state.players);
  const banker = results.find((r) => r.isBanker);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const handleNewGame = () => {
    onNewGame();
    setShowNewGameConfirm(false);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-gold mb-1 flex items-center gap-2">
        Results
        <span className="text-xl" aria-hidden="true">{'\u2666'}</span>
      </h2>
      <p className="text-sm text-text-secondary mb-5">
        Game summary and payouts
      </p>

      {!balanced && (
        <div className="mb-5">
          <WarningBanner
            message={`Warning: Numbers don't balance. Pot was $${getPotTotal(state.players).toFixed(2)} but total cashout is $${getTotalCashout(state.players).toFixed(2)}.`}
          />
        </div>
      )}

      {/* Zelle Transactions */}
      <div className="mb-6">
        <h3 className="text-sm text-text-secondary font-medium uppercase tracking-wider mb-3">
          Zelle Payments
        </h3>
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-surface rounded-xl border border-gold/15 p-4 animate-fade-in"
              >
                <div className="flex-1">
                  <p className="text-text-primary text-sm">
                    <span className="font-semibold text-gold">{tx.from}</span>
                    {' sends '}
                    <span className="font-semibold text-win">${tx.amount.toFixed(2)}</span>
                    {' to '}
                    <span className="font-semibold">{tx.to}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`${tx.from} sends $${tx.amount.toFixed(2)} to ${tx.to}`, i)
                  }
                  className="text-text-secondary/50 hover:text-text-secondary ml-3 p-1 cursor-pointer"
                  aria-label="Copy transaction"
                >
                  {copiedIdx === i ? (
                    <svg className="w-4 h-4 text-win" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-gold/15 p-4 text-center">
            <p className="text-text-secondary text-sm">
              No Zelle payments needed
              {banker && banker.net >= 0 && (
                <span className="block mt-1 text-win font-medium">
                  {banker.name} profits {formatMoneyWithSign(banker.net)}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Banker summary */}
        {banker && transactions.length > 0 && (
          <div className="mt-3 bg-surface/60 rounded-lg border border-gold/10 p-3">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-gold">{banker.name}</span>
              {' (Banker) net: '}
              <span
                className={`font-semibold ${
                  banker.net > 0 ? 'text-win' : banker.net < 0 ? 'text-loss' : 'text-text-secondary'
                }`}
              >
                {formatMoneyWithSign(banker.net)}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="mb-6">
        <h3 className="text-sm text-text-secondary font-medium uppercase tracking-wider mb-3">
          Leaderboard
        </h3>
        <div className="space-y-2">
          {results.map((result, i) => (
            <div
              key={result.id}
              className={`flex items-center gap-3 bg-surface rounded-xl border p-4 animate-fade-in
                ${RANK_STYLES[i] ?? 'border-gold/10'}`}
            >
              <span
                className={`text-lg font-heading w-7 text-center ${
                  i === 0 ? 'text-gold' : 'text-text-secondary/50'
                }`}
              >
                {i + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-primary truncate">
                    {result.name}
                  </span>
                  {result.isBanker && (
                    <span className="bg-gold text-felt-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                      Banker
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary">
                  In: ${result.totalBuyIn.toFixed(2)} &middot; Out: ${result.cashout.toFixed(2)}
                </p>
              </div>

              <span
                className={`font-semibold text-lg ${
                  result.net > 0 ? 'text-win' : result.net < 0 ? 'text-loss' : 'text-text-secondary'
                }`}
              >
                {formatMoneyWithSign(result.net)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8">
        <SecondaryButton onClick={onBack} className="flex-1">
          Edit Cashout
        </SecondaryButton>
        <GoldButton onClick={() => setShowNewGameConfirm(true)} className="flex-1">
          New Game
        </GoldButton>
      </div>

      <ConfirmDialog
        isOpen={showNewGameConfirm}
        title="Start New Game"
        message="This will clear all current game data. Are you sure?"
        confirmLabel="New Game"
        onConfirm={handleNewGame}
        onCancel={() => setShowNewGameConfirm(false)}
      />
    </div>
  );
}
