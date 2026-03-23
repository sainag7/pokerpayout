import type { GameState } from '../types/game';

export const initialState: GameState = {
  currentStep: 1,
  players: [],
  createdAt: new Date().toISOString(),
};
