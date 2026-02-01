export type PlayerState = {
  coins: number;
  reputation: number;
  quest1Complete: boolean;
  xp: number;
  streak: number;
};

const STORAGE_KEY = "wss_sprout_player_state";

export const defaultPlayerState: PlayerState = {
  coins: 0,
  reputation: 50,
  quest1Complete: false,
  xp: 0,
  streak: 0,
};

export const clampReputation = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};

export const loadPlayerState = (): PlayerState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPlayerState;
  try {
    const parsed = JSON.parse(raw) as PlayerState;
    return {
      coins: typeof parsed.coins === "number" ? parsed.coins : defaultPlayerState.coins,
      reputation:
        typeof parsed.reputation === "number"
          ? clampReputation(parsed.reputation)
          : defaultPlayerState.reputation,
      quest1Complete: Boolean(parsed.quest1Complete),
      xp: typeof parsed.xp === "number" ? parsed.xp : defaultPlayerState.xp,
      streak: typeof parsed.streak === "number" ? parsed.streak : defaultPlayerState.streak,
    };
  } catch {
    return defaultPlayerState;
  }
};

export const savePlayerState = (state: PlayerState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
