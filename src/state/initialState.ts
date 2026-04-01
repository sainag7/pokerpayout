import type { GameState } from '../types/game';

export const initialState: GameState = {
  currentStep: 1,
  mode: null,
  players: [],
  createdAt: new Date().toISOString(),
};
