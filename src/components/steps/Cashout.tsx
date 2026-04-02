import { useState } from 'react';
import type { GameState } from '../../types/game';
import type { GameAction } from '../../state/gameReducer';
import {
  getPotTotal,
  getTotalBuyIn,
  formatMoneyWithSign,
} from '../../utils/calculations';
import { MoneyInput } from '../shared/MoneyInput';
import { WarningBanner } from '../shared/WarningBanner';
import { NavigationButtons } from '../layout/NavigationButtons';

interface CashoutProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

export function Cashout({ state, dispatch, onNext, onBack, onReset }: CashoutProps) {
  const [cashoutValues, setCashoutValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    state.players.forEach((p) => {
      initial[p.id] = p.cashout !== null ? String(p.cashout) : '';
    });
    return initial;
  });

  const potTotal = getPotTotal(state.players);
  const totalCashedOut = state.players.reduce((sum, p) => {
    const val = parseFloat(cashoutValues[p.id] ?? '');
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  const balanced = Math.abs(potTotal - totalCashedOut) < 0.01;
  const allFilled = state.players.every((p) => {
    const val = cashoutValues[p.id];
    return val !== '' && val !== undefined && !isNaN(parseFloat(val)) && parseFloat(val) >= 0;
  });

  const handleCashoutChange = (playerId: string, value: string) => {
    setCashoutValues((prev) => ({ ...prev, [playerId]: value }));
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      dispatch({ type: 'SET_CASHOUT', payload: { id: playerId, amount: num } });
    }
  };

  const handleNext = () => {
    // Ensure all values are committed to state
    state.players.forEach((p) => {
      const val = parseFloat(cashoutValues[p.id] ?? '');
      if (!isNaN(val) && val >= 0) {
        dispatch({ type: 'SET_CASHOUT', payload: { id: p.id, amount: val } });
      }
    });
    onNext();
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-gold mb-1">Cashout</h2>
      <p className="text-sm text-text-secondary mb-5">
        Enter each player's final chip count in dollars
      </p>

      {/* Balance indicator */}
      <div className="bg-surface/60 rounded-xl border border-gold/20 p-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary">Total Pot</span>
          <span className="font-semibold text-gold">${potTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-text-secondary">Cashed Out</span>
          <span
            className={`font-semibold ${
              balanced ? 'text-win' : totalCashedOut > 0 ? 'text-warning' : 'text-text-secondary'
            }`}
          >
            ${totalCashedOut.toFixed(2)}
          </span>
        </div>
        {totalCashedOut > 0 && !balanced && (
          <div className="mt-2 pt-2 border-t border-gold/10">
            <span className="text-xs text-warning">
              Off by ${Math.abs(potTotal - totalCashedOut).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {!balanced && allFilled && (
        <div className="mb-4">
          <WarningBanner
            message={`Numbers don't add up. Total cashed out ($${totalCashedOut.toFixed(2)}) should equal total pot ($${potTotal.toFixed(2)}). Off by $${Math.abs(potTotal - totalCashedOut).toFixed(2)}.`}
          />
        </div>
      )}

      {/* Player cashout inputs */}
      <div className="space-y-3 mb-4">
        {state.players.map((player) => {
          const val = cashoutValues[player.id] ?? '';
          const numVal = parseFloat(val);
          const totalBuyIn = getTotalBuyIn(player);
          const net = !isNaN(numVal) ? numVal - totalBuyIn : null;

          return (
            <div
              key={player.id}
              className="bg-surface rounded-xl border border-gold/15 p-4 animate-fade-in"
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-text-primary">{player.name}</h3>
                {player.isBanker && (
                  <span className="bg-gold text-felt-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Banker
                  </span>
                )}
                <span className="text-xs text-text-secondary ml-auto">
                  Buy-in: ${totalBuyIn.toFixed(2)}
                </span>
              </div>

              <MoneyInput
                value={val}
                onChange={(v) => handleCashoutChange(player.id, v)}
                placeholder="Final chips"
              />

              {net !== null && val !== '' && (
                <p
                  className={`text-sm font-medium mt-2 ${
                    net > 0 ? 'text-win' : net < 0 ? 'text-loss' : 'text-text-secondary'
                  }`}
                >
                  Net: {formatMoneyWithSign(net)}
                  {numVal === 0 && <span className="text-text-secondary/60 ml-2">Busted</span>}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleNext}
        nextLabel="See Results"
        nextDisabled={!allFilled}
        onReset={onReset}
      />
    </div>
  );
}
