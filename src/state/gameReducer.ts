import type { GameState, Player } from '../types/game';
import { initialState } from './initialState';

export type GameAction =
  | { type: 'ADD_PLAYER'; payload: { name: string; buyIn: number } }
  | { type: 'REMOVE_PLAYER'; payload: { id: string } }
  | { type: 'SET_BANKER'; payload: { id: string } }
  | { type: 'EDIT_BUYIN'; payload: { id: string; amount: number } }
  | { type: 'ADD_REBUY'; payload: { id: string; amount: number } }
  | { type: 'SET_CASHOUT'; payload: { id: string; amount: number } }
  | { type: 'CLEAR_ALL_CASHOUTS' }
  | { type: 'SET_STEP'; payload: { step: 1 | 2 | 3 | 4 } }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_STATE'; payload: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: action.payload.name.trim(),
        buyIns: [action.payload.buyIn],
        cashout: null,
        isBanker: state.players.length === 0,
      };
      return { ...state, players: [...state.players, newPlayer] };
    }

    case 'REMOVE_PLAYER': {
      const removed = state.players.find((p) => p.id === action.payload.id);
      const remaining = state.players.filter((p) => p.id !== action.payload.id);
      if (removed?.isBanker && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isBanker: true };
      }
      return { ...state, players: remaining };
    }

    case 'SET_BANKER': {
      return {
        ...state,
        players: state.players.map((p) => ({
          ...p,
          isBanker: p.id === action.payload.id,
        })),
      };
    }

    case 'EDIT_BUYIN': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id
            ? { ...p, buyIns: [action.payload.amount, ...p.buyIns.slice(1)] }
            : p
        ),
      };
    }

    case 'ADD_REBUY': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id
            ? { ...p, buyIns: [...p.buyIns, action.payload.amount] }
            : p
        ),
      };
    }

    case 'SET_CASHOUT': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id
            ? { ...p, cashout: action.payload.amount }
            : p
        ),
      };
    }

    case 'CLEAR_ALL_CASHOUTS': {
      return {
        ...state,
        players: state.players.map((p) => ({ ...p, cashout: null })),
      };
    }

    case 'SET_STEP': {
      return { ...state, currentStep: action.payload.step };
    }

    case 'RESET_GAME': {
      return { ...initialState, createdAt: new Date().toISOString() };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}
