import type { GameState } from '../types/game';

const SESSION_KEY = 'poker_session_id';
const LS_PREFIX = 'poker_data_';

function getSessionId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function clearAllPokerData(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LS_PREFIX)) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Storage unavailable — ignore
  }
}

export function loadState(): GameState | null {
  try {
    const sessionId = getSessionId();
    if (!sessionId) {
      clearAllPokerData();
      return null;
    }
    const raw = localStorage.getItem(LS_PREFIX + sessionId);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: GameState): void {
  try {
    const sessionId = getOrCreateSessionId();
    localStorage.setItem(LS_PREFIX + sessionId, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function clearState(): void {
  try {
    const sessionId = getSessionId();
    if (sessionId) {
      localStorage.removeItem(LS_PREFIX + sessionId);
    }
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable — ignore
  }
}
