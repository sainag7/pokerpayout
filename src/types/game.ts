export interface Player {
  id: string;
  name: string;
  buyIns: number[];
  cashout: number | null;
  isBanker: boolean;
}

export interface GameState {
  currentStep: 1 | 2 | 3 | 4;
  mode: 'banker' | 'simplified' | null;
  players: Player[];
  createdAt: string;
}

export interface PlayerResult {
  id: string;
  name: string;
  totalBuyIn: number;
  cashout: number;
  net: number;
  isBanker: boolean;
}

export interface ZelleTransaction {
  from: string;
  to: string;
  amount: number;
}
