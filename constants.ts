import { GridPosition, TileType, NPC } from './types';

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
// 0: Empty, 3: Player Start - Clean open grid, no walls
export const INITIAL_MAP: TileType[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 3, 0, 0, 0, 0, 0, 0, 0, 0], // Player start at 3
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const NPCS: NPC[] = [
  // === LEVEL 1: Saving Basics ===
  {
    id: 'piggy-1',
    name: 'Penny the Pig',
    icon: '🐷',
    position: { x: 3, y: 2 },
    levelId: 1,
    story: {
      prompt: "Oink! I just got 10 coins for my birthday! Should I put them in my piggy bank or spend them all on candy?",
      options: [
        { text: "Spend it all on candy!", coins: 10 },
        { text: "Save it in the piggy bank!" },
        { text: "Throw the coins in the fountain!" }
      ],
      correctAnswerIndex: 1,
      explanation: "Saving your birthday money helps you buy something really special later! Great choice!",
      reward: { xp: 15, coins: 5 }
    }
  },
  {
    id: 'turtle-1',
    name: 'Shelly the Turtle',
    icon: '🐢',
    position: { x: 7, y: 4 },
    levelId: 1,
    story: {
      prompt: "I walk slowly but save steadily! If you save 2 coins every day, how many will you have after 5 days?",
      options: [
        { text: "5 coins" },
        { text: "10 coins" },
        { text: "2 coins" }
      ],
      correctAnswerIndex: 1,
      explanation: "2 coins × 5 days = 10 coins! Saving a little bit every day adds up to a lot!",
      reward: { xp: 20, coins: 10 }
    }
  },
  {
    id: 'ant-1',
    name: 'Andy the Ant',
    icon: '🐜',
    position: { x: 2, y: 7 },
    levelId: 1,
    story: {
      prompt: "We ants save food for winter! What's the BEST reason to save your coins?",
      options: [
        { text: "So I can buy something bigger later!" },
        { text: "Because coins are heavy to carry." },
        { text: "I don't know, saving is boring!" }
      ],
      correctAnswerIndex: 0,
      explanation: "Exactly! Saving helps you afford bigger and better things in the future!",
      reward: { xp: 15, coins: 5 }
    }
  },

  // === LEVEL 2: Needs vs Wants ===
  {
    id: 'owl-2',
    name: 'Wise Owl',
    icon: '🦉',
    position: { x: 4, y: 2 },
    levelId: 2,
    story: {
      prompt: "Hoot! You have 10 coins. You NEED new shoes for school (8 coins), but you WANT a toy robot (10 coins). What should you buy?",
      options: [
        { text: "The toy robot!", coins: 10 },
        { text: "The shoes I need!", coins: 8 },
        { text: "Neither, save everything!" }
      ],
      correctAnswerIndex: 1,
      explanation: "Needs come before wants! Shoes for school are important. You can save for the robot later!",
      reward: { xp: 20, coins: 5 }
    }
  },
  {
    id: 'bunny-2',
    name: 'Bella Bunny',
    icon: '🐰',
    position: { x: 8, y: 5 },
    levelId: 2,
    story: {
      prompt: "I love carrots! But which of these is a NEED and not just a WANT?",
      options: [
        { text: "A video game" },
        { text: "Food for lunch" },
        { text: "A new toy" }
      ],
      correctAnswerIndex: 1,
      explanation: "Food is something we NEED to stay healthy. Games and toys are WANTS - nice to have but not necessary!",
      reward: { xp: 15, coins: 5 }
    }
  },
  {
    id: 'fox-2',
    name: 'Felix the Fox',
    icon: '🦊',
    position: { x: 2, y: 8 },
    levelId: 2,
    story: {
      prompt: "I'm clever with money! If you only have 5 coins, should you buy a snack (3 coins) or a fancy hat (5 coins)?",
      options: [
        { text: "The fancy hat - it's so cool!", coins: 5 },
        { text: "The snack - I need energy!", coins: 3 },
        { text: "Buy both somehow!" }
      ],
      correctAnswerIndex: 1,
      explanation: "Smart thinking! A snack gives you energy (a need), and you'll still have 2 coins left to save!",
      reward: { xp: 20, coins: 8 }
    }
  },

  // === LEVEL 3: Earn & Spend ===
  {
    id: 'bee-3',
    name: 'Busy Bee',
    icon: '🐝',
    position: { x: 5, y: 3 },
    levelId: 3,
    story: {
      prompt: "Buzz! I work hard making honey! If you do chores and earn 5 coins, then spend 3 coins, how many do you have left?",
      options: [
        { text: "2 coins" },
        { text: "8 coins" },
        { text: "0 coins" }
      ],
      correctAnswerIndex: 0,
      explanation: "5 coins earned - 3 coins spent = 2 coins left! Always know how much you have after spending!",
      reward: { xp: 15, coins: 5 }
    }
  },
  {
    id: 'dog-3',
    name: 'Duke the Dog',
    icon: '🐕',
    position: { x: 3, y: 6 },
    levelId: 3,
    story: {
      prompt: "Woof! I walk dogs to earn coins! Which is the BEST way to earn money?",
      options: [
        { text: "Wait for someone to give it to me" },
        { text: "Help with chores or tasks" },
        { text: "Wish really hard for it" }
      ],
      correctAnswerIndex: 1,
      explanation: "Working and helping others is how we earn money! Every little task can add coins to your savings!",
      reward: { xp: 20, coins: 10 }
    }
  },
  {
    id: 'cat-3',
    name: 'Callie the Cat',
    icon: '🐱',
    position: { x: 7, y: 8 },
    levelId: 3,
    story: {
      prompt: "Meow! You earned 20 coins from helping your neighbor. A smart spender would...",
      options: [
        { text: "Spend it all right away!", coins: 20 },
        { text: "Save some and spend some wisely" },
        { text: "Hide it and forget about it" }
      ],
      correctAnswerIndex: 1,
      explanation: "Balance is key! Save some for later and spend some on things you need. That's being money-smart!",
      reward: { xp: 25, coins: 10 }
    }
  },

  // === LEVEL 4: Future Goals ===
  {
    id: 'eagle-4',
    name: 'Eddie Eagle',
    icon: '🦅',
    position: { x: 6, y: 3 },
    levelId: 4,
    story: {
      prompt: "I can see far into the future! You want a bike that costs 50 coins. You have 10 coins and can save 5 per week. How many weeks until you can buy it?",
      options: [
        { text: "8 weeks" },
        { text: "5 weeks" },
        { text: "10 weeks" }
      ],
      correctAnswerIndex: 0,
      explanation: "You need 40 more coins (50-10). At 5 coins per week, that's 8 weeks! Setting goals helps you plan!",
      reward: { xp: 25, coins: 10 }
    }
  },
  {
    id: 'elephant-4',
    name: 'Ellie Elephant',
    icon: '🐘',
    position: { x: 2, y: 5 },
    levelId: 4,
    story: {
      prompt: "I never forget my goals! What helps you save for something big?",
      options: [
        { text: "Buying small things every day" },
        { text: "Setting a goal and saving regularly" },
        { text: "Hoping prices go down" }
      ],
      correctAnswerIndex: 1,
      explanation: "Setting a clear goal and saving a little bit regularly is the BEST way to afford big things!",
      reward: { xp: 20, coins: 8 }
    }
  },
  {
    id: 'lion-4',
    name: 'Leo the Lion',
    icon: '🦁',
    position: { x: 5, y: 7 },
    levelId: 4,
    story: {
      prompt: "Roar! I'm saving for college one day! Why is it good to start saving early for big goals?",
      options: [
        { text: "You have more time to save more!" },
        { text: "Coins get heavier over time" },
        { text: "It's not important when you start" }
      ],
      correctAnswerIndex: 0,
      explanation: "Starting early gives you more time to save! Even small amounts grow big over many years!",
      reward: { xp: 30, coins: 15 }
    }
  }
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