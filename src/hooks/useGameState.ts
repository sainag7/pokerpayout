import { useReducer, useEffect } from 'react';
import { gameReducer, type GameAction } from '../state/gameReducer';
import { initialState } from '../state/initialState';
import { loadState, saveState } from '../state/localStorage';
import type { GameState } from '../types/game';

export function useGameState(): {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} {
  const [state, dispatch] = useReducer(gameReducer, initialState, (init) => {
    const saved = loadState();
    return saved ?? init;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return { state, dispatch };
}
