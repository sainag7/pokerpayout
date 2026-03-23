import { useState } from 'react';
import type { GameState } from '../../types/game';
import type { GameAction } from '../../state/gameReducer';
import { validatePlayerName, validateBuyIn } from '../../utils/validation';
import { PlayerCard } from '../shared/PlayerCard';
import { MoneyInput } from '../shared/MoneyInput';
import { GoldButton } from '../shared/GoldButton';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { NavigationButtons } from '../layout/NavigationButtons';

interface GameSetupProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onNext: () => void;
}

export function GameSetup({ state, dispatch, onNext }: GameSetupProps) {
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [buyInError, setBuyInError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const handleAdd = () => {
    const existingNames = state.players.map((p) => p.name);
    const nErr = validatePlayerName(name, existingNames);
    const bErr = validateBuyIn(buyIn);
    setNameError(nErr);
    setBuyInError(bErr);
    if (nErr || bErr) return;

    dispatch({
      type: 'ADD_PLAYER',
      payload: { name: name.trim(), buyIn: parseFloat(buyIn) },
    });
    setName('');
    setBuyIn('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const hasBanker = state.players.some((p) => p.isBanker);
  const canProceed = state.players.length >= 2 && hasBanker;

  return (
    <div>
      <h2 className="font-heading text-2xl text-gold mb-1">Game Setup</h2>
      <p className="text-sm text-text-secondary mb-5">
        Add players and set their buy-in amounts
      </p>

      {/* Add player form */}
      <div className="bg-surface/60 rounded-xl border border-gold/10 p-4 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="player-name" className="text-sm text-text-secondary">
              Player Name
            </label>
            <input
              id="player-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter name"
              autoCapitalize="words"
              maxLength={20}
              className="bg-felt-black border border-gold/30 rounded-lg px-3 py-2.5 text-lg
                text-text-primary placeholder:text-text-secondary/40 outline-none
                focus:border-gold transition-colors duration-150"
            />
            {nameError && <p className="text-xs text-loss">{nameError}</p>}
          </div>

          <MoneyInput
            id="buy-in"
            label="Buy-in Amount"
            value={buyIn}
            onChange={(v) => {
              setBuyIn(v);
              setBuyInError(null);
            }}
            error={buyInError}
          />

          <GoldButton onClick={handleAdd} className="w-full mt-1">
            Add Player
          </GoldButton>
        </div>
      </div>

      {/* Player list */}
      {state.players.length > 0 && (
        <div className="space-y-3 mb-4">
          <h3 className="text-sm text-text-secondary font-medium uppercase tracking-wider">
            Players ({state.players.length})
          </h3>
          {state.players.map((player, i) => (
            <PlayerCard key={player.id} player={player} index={i}>
              <div className="flex gap-2">
                {!player.isBanker && (
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: 'SET_BANKER', payload: { id: player.id } })
                    }
                    className="text-xs text-gold/70 hover:text-gold border border-gold/20
                      hover:border-gold/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Set as Banker
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setRemoveTarget(player.id)}
                  className="text-xs text-loss/70 hover:text-loss border border-loss/20
                    hover:border-loss/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </PlayerCard>
          ))}
        </div>
      )}

      {state.players.length === 0 && (
        <div className="text-center py-10 text-text-secondary/50">
          <p className="text-4xl mb-2" aria-hidden="true">{'\u2663'}</p>
          <p className="text-sm">Add at least 2 players to start</p>
        </div>
      )}

      <NavigationButtons
        onNext={onNext}
        nextLabel="Start Game"
        nextDisabled={!canProceed}
      />

      <ConfirmDialog
        isOpen={removeTarget !== null}
        title="Remove Player"
        message={`Remove ${state.players.find((p) => p.id === removeTarget)?.name ?? 'this player'}?`}
        confirmLabel="Remove"
        onConfirm={() => {
          if (removeTarget) dispatch({ type: 'REMOVE_PLAYER', payload: { id: removeTarget } });
          setRemoveTarget(null);
        }}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}
