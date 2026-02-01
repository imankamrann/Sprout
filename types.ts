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
  SHOP = 2,
  START = 3,
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