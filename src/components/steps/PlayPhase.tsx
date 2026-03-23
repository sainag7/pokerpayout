import { useState } from 'react';
import type { GameState } from '../../types/game';
import type { GameAction } from '../../state/gameReducer';
import { getPotTotal } from '../../utils/calculations';
import { validatePlayerName, validateBuyIn } from '../../utils/validation';
import { PlayerCard } from '../shared/PlayerCard';
import { MoneyInput } from '../shared/MoneyInput';
import { GoldButton } from '../shared/GoldButton';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { NavigationButtons } from '../layout/NavigationButtons';

interface PlayPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onNext: () => void;
  onBack: () => void;
}

export function PlayPhase({ state, dispatch, onNext, onBack }: PlayPhaseProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [buyInError, setBuyInError] = useState<string | null>(null);
  const [rebuyPlayerId, setRebuyPlayerId] = useState<string | null>(null);
  const [rebuyAmount, setRebuyAmount] = useState('');
  const [rebuyError, setRebuyError] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

  const potTotal = getPotTotal(state.players);

  const handleAddPlayer = () => {
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
    setShowAddForm(false);
  };

  const handleRebuy = (playerId: string) => {
    const err = validateBuyIn(rebuyAmount);
    setRebuyError(err);
    if (err) return;

    dispatch({
      type: 'ADD_REBUY',
      payload: { id: playerId, amount: parseFloat(rebuyAmount) },
    });
    setRebuyPlayerId(null);
    setRebuyAmount('');
    setRebuyError(null);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl text-gold mb-1">Game in Progress</h2>
      <p className="text-sm text-text-secondary mb-5">
        Manage rebuys and late arrivals
      </p>

      {/* Pot total */}
      <div className="text-center bg-surface/60 rounded-xl border border-gold/20 p-5 mb-6">
        <p className="text-sm text-text-secondary mb-1 uppercase tracking-wider">Total Pot</p>
        <p className="font-heading text-4xl text-gold gold-glow-sm inline-block">
          ${potTotal.toFixed(2)}
        </p>
      </div>

      {/* Player list */}
      <div className="space-y-3 mb-4">
        <h3 className="text-sm text-text-secondary font-medium uppercase tracking-wider">
          Players ({state.players.length})
        </h3>
        {state.players.map((player, i) => (
          <PlayerCard key={player.id} player={player} index={i}>
            <div className="flex flex-wrap gap-2">
              {rebuyPlayerId === player.id ? (
                <div className="flex gap-2 items-end w-full">
                  <div className="flex-1">
                    <MoneyInput
                      value={rebuyAmount}
                      onChange={(v) => {
                        setRebuyAmount(v);
                        setRebuyError(null);
                      }}
                      error={rebuyError}
                      placeholder="Rebuy amount"
                      autoFocus
                    />
                  </div>
                  <GoldButton
                    onClick={() => handleRebuy(player.id)}
                    className="text-sm px-4 py-2.5"
                  >
                    Add
                  </GoldButton>
                  <button
                    type="button"
                    onClick={() => {
                      setRebuyPlayerId(null);
                      setRebuyAmount('');
                      setRebuyError(null);
                    }}
                    className="text-text-secondary/60 hover:text-text-secondary text-sm px-2 py-2.5 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setRebuyPlayerId(player.id);
                      setRebuyAmount('');
                      setRebuyError(null);
                    }}
                    className="text-xs text-gold/70 hover:text-gold border border-gold/20
                      hover:border-gold/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    + Rebuy
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemoveTarget(player.id)}
                    className="text-xs text-loss/70 hover:text-loss border border-loss/20
                      hover:border-loss/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </PlayerCard>
        ))}
      </div>

      {/* Add player form */}
      {showAddForm ? (
        <div className="bg-surface/60 rounded-xl border border-gold/10 p-4 mb-4 animate-fade-in">
          <h3 className="text-sm font-medium text-text-primary mb-3">Add Late Arrival</h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="late-name" className="text-sm text-text-secondary">
                Name
              </label>
              <input
                id="late-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(null);
                }}
                placeholder="Enter name"
                autoCapitalize="words"
                maxLength={20}
                autoFocus
                className="bg-felt-black border border-gold/30 rounded-lg px-3 py-2.5 text-lg
                  text-text-primary placeholder:text-text-secondary/40 outline-none
                  focus:border-gold transition-colors duration-150"
              />
              {nameError && <p className="text-xs text-loss">{nameError}</p>}
            </div>
            <MoneyInput
              label="Buy-in"
              value={buyIn}
              onChange={(v) => {
                setBuyIn(v);
                setBuyInError(null);
              }}
              error={buyInError}
            />
            <div className="flex gap-2">
              <GoldButton onClick={handleAddPlayer} className="flex-1">
                Add Player
              </GoldButton>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setName('');
                  setBuyIn('');
                }}
                className="text-text-secondary hover:text-text-primary px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full border-2 border-dashed border-gold/20 hover:border-gold/40
            rounded-xl py-3 text-sm text-text-secondary hover:text-gold
            transition-colors cursor-pointer mb-4"
        >
          + Add Player
        </button>
      )}

      <NavigationButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel="Cashout"
        nextDisabled={state.players.length < 2}
      />

      <ConfirmDialog
        isOpen={removeTarget !== null}
        title="Remove Player"
        message={`Remove ${state.players.find((p) => p.id === removeTarget)?.name ?? 'this player'} from the game?`}
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
