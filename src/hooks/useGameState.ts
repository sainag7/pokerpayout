import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, type GameAction } from '../state/gameReducer';
import { initialState } from '../state/initialState';
import { loadState, saveState, clearState } from '../state/localStorage';
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

  const wrappedDispatch = useCallback(
    (action: GameAction) => {
      if (action.type === 'RESET_GAME') {
        clearState();
      }
      dispatch(action);
    },
    [dispatch]
  );

  return { state, dispatch: wrappedDispatch };
}
