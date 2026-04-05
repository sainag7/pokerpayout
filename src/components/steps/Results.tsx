import { useState } from 'react';
import type { GameState } from '../../types/game';
import type { GameAction } from '../../state/gameReducer';
import {
  getPlayerResults,
  getZelleTransactions,
  getSimplifiedTransactions,
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
  onReset: () => void;
}

const RANK_STYLES = [
  'border-gold/40 bg-gold/5',
  'border-gold/25',
  'border-gold/15',
];

export function Results({ state, dispatch, onBack, onNewGame, onReset: _onReset }: ResultsProps) {
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const togglePaid = (id: string) => dispatch({ type: 'TOGGLE_PAID', payload: { id } });
  const isPaid = (id: string) => (state.paidPlayerIds ?? []).includes(id);

  const isSimplified = state.mode === 'simplified';
  const results = getPlayerResults(state.players);
  const transactions = isSimplified
    ? getSimplifiedTransactions(state.players)
    : getZelleTransactions(state.players);
  const balanced = isBalanced(state.players);
  const banker = isSimplified ? null : results.find((r) => r.isBanker);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const handleCopyAll = async () => {
    const text = transactions
      .map((tx) => `${tx.from} pays $${tx.amount.toFixed(2)} to ${tx.to}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
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
      <p className="text-sm text-text-secondary mb-4">
        Game summary and payouts
      </p>

      {/* Mode toggle */}
      <div className="flex rounded-xl bg-surface border border-gold/15 p-1 gap-1 mb-2">
        {(['banker', 'simplified'] as const).map((mode) => {
          const isSelected = state.mode === mode;
          const label = mode === 'banker' ? 'Banker Mode' : 'Simplified Payments';
          return (
            <button
              key={mode}
              type="button"
              onClick={() => dispatch({ type: 'SET_MODE', payload: { mode } })}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150 cursor-pointer
                ${isSelected
                  ? mode === 'banker' ? 'bg-gold text-felt-black' : 'bg-win text-felt-black'
                  : 'text-text-secondary hover:text-text-primary'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-text-secondary/60 px-1 mb-5">
        {state.mode === 'banker'
          ? 'One player collects all chips and pays out winners.'
          : state.mode === 'simplified'
          ? 'Fewest possible peer-to-peer payments to settle all debts.'
          : 'Choose a mode to see how to settle up.'}
      </p>

      {!balanced && (
        <div className="mb-5">
          <WarningBanner
            message={`Warning: Numbers don't balance. Pot was $${getPotTotal(state.players).toFixed(2)} but total cashout is $${getTotalCashout(state.players).toFixed(2)}.`}
          />
        </div>
      )}

      {/* Transactions */}
      {state.mode === null ? (
        <div className="bg-surface rounded-xl border border-gold/15 p-6 text-center mb-6">
          <p className="text-text-secondary text-sm">Select a payment mode above to see transactions</p>
        </div>
      ) : (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-text-secondary font-medium uppercase tracking-wider">
            {isSimplified ? 'Settlement Payments' : 'Zelle Payments'}
          </h3>
          {transactions.length > 0 && (
            <button
              type="button"
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 text-xs text-text-secondary/60 hover:text-text-secondary cursor-pointer transition-colors"
            >
              {copiedAll ? (
                <>
                  <svg className="w-3.5 h-3.5 text-win" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-win">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy All
                </>
              )}
            </button>
          )}
        </div>
        {transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-surface rounded-xl border border-gold/15 p-4 animate-fade-in"
              >
                <div className="flex-1">
                  <p className="text-text-primary text-sm">
                    <span className="font-semibold text-loss">{tx.from}</span>
                    {' pays '}
                    <span className="font-semibold text-win">${tx.amount.toFixed(2)}</span>
                    {' to '}
                    <span className="font-semibold text-gold">{tx.to}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`${tx.from} pays $${tx.amount.toFixed(2)} to ${tx.to}`, i)
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
              No payments needed — everyone is even
              {!isSimplified && banker && banker.net >= 0 && (
                <span className="block mt-1 text-win font-medium">
                  {banker.name} profits {formatMoneyWithSign(banker.net)}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Banker summary (banker mode only) */}
        {!isSimplified && banker && transactions.length > 0 && (
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

        {/* Transaction count callout (simplified mode only) */}
        {isSimplified && transactions.length > 0 && (
          <div className="mt-3 bg-surface/60 rounded-lg border border-win/10 p-3">
            <p className="text-sm text-text-secondary">
              <span className="font-medium text-win">{transactions.length}</span>
              {` payment${transactions.length === 1 ? '' : 's'} needed to settle all debts`}
            </p>
          </div>
        )}
      </div>
      )}

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
                  {!isSimplified && result.isBanker && (
                    <span className="bg-gold text-felt-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase shrink-0">
                      Banker
                    </span>
                  )}
                  {!isSimplified && !result.isBanker && (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'SET_BANKER', payload: { id: result.id } })}
                      className="text-[10px] text-gold/50 hover:text-gold border border-gold/15 hover:border-gold/40 rounded-full px-2 py-0.5 transition-colors cursor-pointer shrink-0"
                    >
                      Set Banker
                    </button>
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

              {!isSimplified && !result.isBanker && (
                <button
                  type="button"
                  onClick={() => togglePaid(result.id)}
                  className="shrink-0 cursor-pointer ml-1"
                  aria-label={isPaid(result.id) ? 'Mark as unpaid' : 'Mark as paid'}
                >
                  {isPaid(result.id) ? (
                    <svg className="w-6 h-6 text-win" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-text-secondary/30 hover:text-text-secondary/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="9.25" />
                    </svg>
                  )}
                </button>
              )}
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
