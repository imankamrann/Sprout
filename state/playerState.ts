export type PlayerState = {
  coins: number;
  quest1Complete: boolean;
  streak: number;
};

const STORAGE_KEY = "wss_sprout_player_state";

export const defaultPlayerState: PlayerState = {
  coins: 0,
  quest1Complete: false,
  streak: 0,
};

export const loadPlayerState = (): PlayerState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPlayerState;
  try {
    const parsed = JSON.parse(raw) as PlayerState;
    return {
      coins: typeof parsed.coins === "number" ? parsed.coins : defaultPlayerState.coins,
      quest1Complete: Boolean(parsed.quest1Complete),
      streak: typeof parsed.streak === "number" ? parsed.streak : defaultPlayerState.streak,
    };
  } catch {
    return defaultPlayerState;
  }
};

export const savePlayerState = (state: PlayerState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
