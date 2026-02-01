import { GridPosition, TileType } from './types';

export const GRID_SIZE = 10;

// Colors matching the prompt
export const COLORS = {
  primaryGreen: '#78D230',
  primaryPurple: '#8C82FC',
  background: '#F3F3F3',
  text: '#2D3748',
};

// Initial Player Position
export const INITIAL_PLAYER_POS: GridPosition = { x: 1, y: 1 };

// Define the static map layout (10x10)
// 0: Empty, 1: Wall/Obstacle, 2: Shop/NPC
export const INITIAL_MAP: TileType[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 2, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
  [1, 2, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const SYSTEM_INSTRUCTION = `
You are an educational engine for a kids' financial literacy game called "Wealthsimple Sprout".
Your audience is children aged 8-12.
Generate a multiple-choice scenario involving money management, saving, or basic investing.
Keep the language simple, fun, and encouraging.
The scenario should be a short situation (e.g., "You want to buy a toy...", "You opened a lemonade stand...").
Provide 3 distinct options.
Identify the best financial decision.
`;