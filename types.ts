export interface User {
  username: string;
  email: string;
  xp: number;
  coins: number;
  streak: number;
  completedLevels: number[];
}

export interface GridPosition {
  x: number;
  y: number;
}

export enum TileType {
  EMPTY = 0,
  WALL = 1,
  PROP = 2, // Renamed from SHOP
  START = 3,
  NPC = 4, // New type for NPCs
}

export interface NPC {
  id: string;
  name: string;
  icon: string; // Emoji or image path
  position: GridPosition;
  levelId: number; // Which level this NPC belongs to
  story: {
    prompt: string;
    options: { text: string; coins?: number }[];
    correctAnswerIndex: number;
    explanation: string;
    reward: {
      xp: number;
      coins: number;
    };
  };
}

export interface Scenario {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  reward: {
    xp: number;
    coins: number;
  };
}

// Mocking the Mongoose Schema concept in frontend types
export interface UserSchema extends User {
  _id: string;
}