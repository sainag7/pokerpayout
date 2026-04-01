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
  const [editBuyInPlayerId, setEditBuyInPlayerId] = useState<string | null>(null);
  const [editBuyInAmount, setEditBuyInAmount] = useState('');
  const [editBuyInError, setEditBuyInError] = useState<string | null>(null);

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

  const handleEditBuyIn = (playerId: string) => {
    const err = validateBuyIn(editBuyInAmount);
    setEditBuyInError(err);
    if (err) return;
    dispatch({ type: 'EDIT_BUYIN', payload: { id: playerId, amount: parseFloat(editBuyInAmount) } });
    setEditBuyInPlayerId(null);
    setEditBuyInAmount('');
  };

  const hasBanker = state.players.some((p) => p.isBanker);
  const isBankerMode = state.mode === 'banker';
  const canProceed = state.players.length >= 2 && (isBankerMode ? hasBanker : true);

  const MODE_OPTIONS = [
    {
      value: 'banker' as const,
      label: 'Banker Mode',
      description: 'One player acts as the central banker. All winners receive their cashout directly from the banker via Zelle.',
    },
    {
      value: 'simplified' as const,
      label: 'Simplified Payments',
      description: 'No banker needed. Calculates the fewest peer-to-peer Zelle payments to settle all debts.',
    },
  ];

  const selectedMode = MODE_OPTIONS.find((o) => o.value === state.mode) ?? MODE_OPTIONS[0];

  return (
    <div>
      <h2 className="font-heading text-2xl text-gold mb-1">Game Setup</h2>
      <p className="text-sm text-text-secondary mb-4">
        Add players and set their buy-in amounts
      </p>

      {/* Mode segmented control */}
      <div className="mb-5">
        <div className="flex rounded-xl bg-surface border border-gold/15 p-1 gap-1">
          {MODE_OPTIONS.map((option) => {
            const isSelected = state.mode === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => dispatch({ type: 'SET_MODE', payload: { mode: option.value } })}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-150 cursor-pointer
                  ${isSelected
                    ? option.value === 'banker'
                      ? 'bg-gold text-felt-black'
                      : 'bg-win text-felt-black'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {state.mode === null ? (
          <p className="text-xs text-gold/70 mt-2 px-1">Select a mode to continue</p>
        ) : (
          <p className="text-xs text-text-secondary/70 mt-2 px-1">{selectedMode.description}</p>
        )}
      </div>

      {state.mode === null && (
        <div className="text-center py-10 text-text-secondary/50">
          <p className="text-4xl mb-2" aria-hidden="true">{'\u2660'}</p>
          <p className="text-sm">Choose a mode above to get started</p>
        </div>
      )}

      {state.mode !== null && (<>

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
            <PlayerCard key={player.id} player={player} index={i} showBankerBadge={isBankerMode}>
              {editBuyInPlayerId === player.id ? (
                <div className="flex flex-col gap-2 w-full">
                  <MoneyInput
                    value={editBuyInAmount}
                    onChange={(v) => { setEditBuyInAmount(v); setEditBuyInError(null); }}
                    error={editBuyInError}
                    placeholder="New buy-in amount"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-center">
                    <GoldButton
                      onClick={() => handleEditBuyIn(player.id)}
                      className="text-sm px-4 py-2.5"
                    >
                      Save
                    </GoldButton>
                    <button
                      type="button"
                      onClick={() => { setEditBuyInPlayerId(null); setEditBuyInAmount(''); setEditBuyInError(null); }}
                      className="text-text-secondary/60 hover:text-text-secondary text-sm px-2 py-2.5 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditBuyInPlayerId(player.id); setEditBuyInAmount(String(player.buyIns[0])); setEditBuyInError(null); }}
                    className="text-xs text-gold/70 hover:text-gold border border-gold/20
                      hover:border-gold/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
                  >
                    Edit Buy-in
                  </button>
                  {isBankerMode && !player.isBanker && (
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: 'SET_BANKER', payload: { id: player.id } })
                      }
                      className="text-xs text-win/70 hover:text-win border border-win/20
                        hover:border-win/40 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
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
              )}
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
      </>)}

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
