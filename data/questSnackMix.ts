export type SnackCategory = "fuel" | "treat";

export type SnackItem = {
  id: string;
  name: string;
  cost: number;
  icon: string;
  category: SnackCategory;
  description: string;
};

export const snackItems: SnackItem[] = [
  { id: "apple-pack", name: "Apple pack", cost: 5, icon: "🍎", category: "fuel", description: "Keeps you running" },
  { id: "granola", name: "Granola bar", cost: 4, icon: "🥜", category: "fuel", description: "Quick energy boost" },
  { id: "yogurt", name: "Yogurt", cost: 6, icon: "🥛", category: "fuel", description: "Protein power" },
  { id: "candy", name: "Candy", cost: 6, icon: "🍬", category: "treat", description: "Sweet but short" },
  { id: "cookies", name: "Cookies", cost: 7, icon: "🍪", category: "treat", description: "Yummy crunch" },
  { id: "soda", name: "Soda", cost: 8, icon: "🥤", category: "treat", description: "Fizzy fun" },
];

export const questCopy = {
  // Ms. Laila's intro dialogue
  introLines: [
    "Lunch is soon. We have 20 coins.",
    "Pick 2 Fuel snacks first. Then you can pick 1 Treat if you can afford it.",
    "Try to keep 2 coins left for surprises.",
  ],
  startButton: "Start Restock",
  
  // Surprise 1: Emergency request from student
  emergency: {
    message: "I need an energy snack for recess.",
    speaker: "STUDENT",
    choices: {
      fuel: "Give them a Fuel snack",
      treat: "Give them a Treat snack",
    },
    reactions: {
      fuel: "Nice choice. That helps them for recess.",
      treat: "Treats are fun, but energy snacks help more.",
    },
  },
  
  // Surprise 2: Hidden fee at checkout
  fee: {
    message: "Store fee today: +2 coins",
    hint: "That's why we save a little.",
    failMessage: "Oops, you need 2 coins for the fee. Try swapping one item.",
  },
  
  // Surprise 3: Scam message
  scam: {
    message: "Pay 10 coins now and we'll send DOUBLE snacks tomorrow!",
    speaker: "📱 MYSTERY TEXT",
    choices: {
      pay: "Pay now",
      ask: "Ask Ms. Laila",
    },
    reactions: {
      pay: "That was a scam! Never pay people you don't know online.",
      ask: "Good job! If it sounds too good to be true, it's probably a scam.",
    },
    rule: "Stop. Don't pay. Ask a grown up.",
  },
  
  // Results
  result: {
    questComplete: "Quest Complete!",
    badgeTitle: "Badge Earned",
    badgeName: "🏆 Snack Boss",
    tip: "Budget = Fuel first + save a little.",
    returnButton: "Return to store",
    stats: {
      coinsLeft: "Coins left",
      xpEarned: "XP earned",
      reputation: "Reputation",
    },
  },
  
  // Toast messages
  toasts: {
    plannedWell: "You planned well!",
    tryAgain: "Next time, save a little more.",
  },
  
  // Coach hints
  coachHints: {
    fuelFirst: "Fuel snacks first. They help with energy!",
    slotMismatch: "Fuel slots need Fuel snacks. Treat slot needs Treat.",
    overBudget: "Too much! Swap an item.",
    needTwoFuel: "Pick 2 Fuel snacks first.",
    default: "Pick 2 Fuel snacks, then 1 Treat.",
  },
};
