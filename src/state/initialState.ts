import type { GameState } from '../types/game';

export const initialState: GameState = {
  currentStep: 1,
  mode: null,
  players: [],
  paidPlayerIds: [],
  createdAt: new Date().toISOString(),
};
