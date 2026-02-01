// Quest data for all levels - same structure as the Snack Mix quest

export type ItemCategory = "need" | "want" | "earn" | "save";

export type QuestItem = {
  id: string;
  name: string;
  cost: number;
  icon: string;
  category: ItemCategory;
  description: string;
};

export type QuestData = {
  levelId: number;
  title: string;
  budget: number;
  items: QuestItem[];
  slotConfig: {
    slot1: { label: string; category: ItemCategory };
    slot2: { label: string; category: ItemCategory };
    slot3: { label: string; category: ItemCategory };
  };
  introLines: string[];
  startButton: string;
  emergency: {
    message: string;
    speaker: string;
    choices: { option1: string; option2: string };
    reactions: { option1: string; option2: string };
    correctOption: "option1" | "option2";
  };
  fee: {
    message: string;
    hint: string;
    failMessage: string;
    amount: number;
  };
  scam: {
    message: string;
    speaker: string;
    choices: { pay: string; ask: string };
    reactions: { pay: string; ask: string };
    rule: string;
  };
  result: {
    questComplete: string;
    badgeTitle: string;
    badgeName: string;
    tip: string;
    returnButton: string;
  };
  coachHints: {
    default: string;
    slotMismatch: string;
    overBudget: string;
    needMore: string;
  };
};

// ============ LEVEL 1: SAVING BASICS ============
export const level1Quest: QuestData = {
  levelId: 1,
  title: "Saving Basics",
  budget: 20,
  items: [
    { id: "apple-pack", name: "Apple pack", cost: 5, icon: "🍎", category: "need", description: "Keeps you running" },
    { id: "granola", name: "Granola bar", cost: 4, icon: "🥜", category: "need", description: "Quick energy boost" },
    { id: "yogurt", name: "Yogurt", cost: 6, icon: "🥛", category: "need", description: "Protein power" },
    { id: "candy", name: "Candy", cost: 6, icon: "🍬", category: "want", description: "Sweet but short" },
    { id: "cookies", name: "Cookies", cost: 7, icon: "🍪", category: "want", description: "Yummy crunch" },
    { id: "soda", name: "Soda", cost: 8, icon: "🥤", category: "want", description: "Fizzy fun" },
  ],
  slotConfig: {
    slot1: { label: "Fuel 1", category: "need" },
    slot2: { label: "Fuel 2", category: "need" },
    slot3: { label: "Treat", category: "want" },
  },
  introLines: [
    "Lunch is soon. We have 20 coins.",
    "Pick 2 Fuel snacks first. Then you can pick 1 Treat if you can afford it.",
    "Try to keep 2 coins left for surprises.",
  ],
  startButton: "Start Restock",
  emergency: {
    message: "I need an energy snack for recess.",
    speaker: "STUDENT",
    choices: { option1: "Give them a Fuel snack", option2: "Give them a Treat snack" },
    reactions: { option1: "Nice choice. That helps them for recess.", option2: "Treats are fun, but energy snacks help more." },
    correctOption: "option1",
  },
  fee: {
    message: "Store fee today: +2 coins",
    hint: "That's why we save a little.",
    failMessage: "Oops, you need 2 coins for the fee. Try swapping one item.",
    amount: 2,
  },
  scam: {
    message: "Pay 10 coins now and we'll send DOUBLE snacks tomorrow!",
    speaker: "📱 MYSTERY TEXT",
    choices: { pay: "Pay now", ask: "Ask Ms. Laila" },
    reactions: { pay: "That was a scam! Never pay people you don't know online.", ask: "Good job! If it sounds too good to be true, it's probably a scam." },
    rule: "Stop. Don't pay. Ask a grown up.",
  },
  result: {
    questComplete: "Quest Complete!",
    badgeTitle: "Badge Earned",
    badgeName: "🏆 Snack Boss",
    tip: "Budget = Fuel first + save a little.",
    returnButton: "Return to store",
  },
  coachHints: {
    default: "Pick 2 Fuel snacks, then 1 Treat.",
    slotMismatch: "Fuel slots need Fuel snacks. Treat slot needs Treat.",
    overBudget: "Too much! Swap an item.",
    needMore: "Pick 2 Fuel snacks first.",
  },
};

// ============ LEVEL 2: NEEDS VS WANTS ============
export const level2Quest: QuestData = {
  levelId: 2,
  title: "Needs vs Wants",
  budget: 25,
  items: [
    { id: "notebook", name: "Notebook", cost: 5, icon: "📓", category: "need", description: "For taking notes" },
    { id: "pencils", name: "Pencils", cost: 3, icon: "✏️", category: "need", description: "Write and draw" },
    { id: "lunch-box", name: "Lunch box", cost: 8, icon: "🍱", category: "need", description: "Keeps food fresh" },
    { id: "stickers", name: "Stickers", cost: 4, icon: "⭐", category: "want", description: "Fun decorations" },
    { id: "toy-car", name: "Toy car", cost: 10, icon: "🚗", category: "want", description: "Zoom zoom!" },
    { id: "slime", name: "Slime", cost: 6, icon: "🟢", category: "want", description: "Squishy fun" },
  ],
  slotConfig: {
    slot1: { label: "Need 1", category: "need" },
    slot2: { label: "Need 2", category: "need" },
    slot3: { label: "Want", category: "want" },
  },
  introLines: [
    "School shopping time! You have 25 coins.",
    "First, pick 2 things you NEED for school.",
    "Then pick 1 thing you WANT. Remember to save some coins!",
  ],
  startButton: "Start Shopping",
  emergency: {
    message: "Oh no! Your friend forgot their pencil case.",
    speaker: "FRIEND",
    choices: { option1: "Share your pencils", option2: "Say you need them all" },
    reactions: { option1: "Great sharing! Friends help each other.", option2: "It's okay to share sometimes!" },
    correctOption: "option1",
  },
  fee: {
    message: "Shopping bag fee: +2 coins",
    hint: "Always budget for extra costs!",
    failMessage: "You need 2 coins for the bag. Remove something.",
    amount: 2,
  },
  scam: {
    message: "Buy this mystery box for 15 coins - worth 100 coins inside!",
    speaker: "📦 MYSTERY SELLER",
    choices: { pay: "Buy the box", ask: "Ask a parent first" },
    reactions: { pay: "The box was empty! Mystery deals are usually tricks.", ask: "Smart! Always check with an adult before buying mystery things." },
    rule: "If it sounds too good, ask first!",
  },
  result: {
    questComplete: "Shopping Done!",
    badgeTitle: "Badge Earned",
    badgeName: "🎒 Smart Shopper",
    tip: "Needs before wants = smart spending!",
    returnButton: "Return to mall",
  },
  coachHints: {
    default: "Pick 2 Needs first, then 1 Want.",
    slotMismatch: "Need slots need Need items. Want slot needs a Want.",
    overBudget: "Over budget! Try a cheaper item.",
    needMore: "Pick 2 Need items first.",
  },
};

// ============ LEVEL 3: EARN & SPEND ============
export const level3Quest: QuestData = {
  levelId: 3,
  title: "Earn & Spend",
  budget: 15,
  items: [
    { id: "lemonade", name: "Lemonade cups", cost: 4, icon: "🍋", category: "need", description: "To sell drinks" },
    { id: "lemons", name: "Fresh lemons", cost: 5, icon: "🍋", category: "need", description: "Main ingredient" },
    { id: "sugar", name: "Sugar pack", cost: 3, icon: "🍬", category: "need", description: "Makes it sweet" },
    { id: "fancy-sign", name: "Fancy sign", cost: 8, icon: "🎨", category: "want", description: "Looks cool!" },
    { id: "balloons", name: "Balloons", cost: 5, icon: "🎈", category: "want", description: "Party vibes" },
    { id: "glitter", name: "Glitter", cost: 4, icon: "✨", category: "want", description: "Extra sparkle" },
  ],
  slotConfig: {
    slot1: { label: "Supply 1", category: "need" },
    slot2: { label: "Supply 2", category: "need" },
    slot3: { label: "Extra", category: "want" },
  },
  introLines: [
    "You're starting a lemonade stand! Budget: 15 coins.",
    "First, buy 2 things you NEED to make lemonade.",
    "Then you can buy 1 extra if you have coins left.",
  ],
  startButton: "Start Business",
  emergency: {
    message: "A customer wants to pay with a 20-coin bill for a 5-coin drink.",
    speaker: "CUSTOMER",
    choices: { option1: "Give 15 coins change", option2: "Keep all the money" },
    reactions: { option1: "Correct! 20 - 5 = 15 coins change. Good math!", option2: "That's not honest! Always give correct change." },
    correctOption: "option1",
  },
  fee: {
    message: "Permit fee to sell: +3 coins",
    hint: "Businesses have costs too!",
    failMessage: "Need 3 coins for the permit. Adjust your cart.",
    amount: 3,
  },
  scam: {
    message: "Give me your stand and I'll triple your money overnight!",
    speaker: "🎭 STRANGER",
    choices: { pay: "Give them the stand", ask: "Say no and tell an adult" },
    reactions: { pay: "They ran away with your stand! Never trust strangers with your things.", ask: "Perfect! Your business is safe. Never trust strangers." },
    rule: "Keep your money safe from strangers.",
  },
  result: {
    questComplete: "Business Success!",
    badgeTitle: "Badge Earned",
    badgeName: "🍋 Lemonade Pro",
    tip: "Spend to earn, but spend wisely!",
    returnButton: "Close stand",
  },
  coachHints: {
    default: "Pick 2 supplies, then 1 extra.",
    slotMismatch: "Supply slots need supplies. Extra slot is for extras.",
    overBudget: "Too expensive! Pick cheaper items.",
    needMore: "Get 2 supplies first.",
  },
};

// ============ LEVEL 4: FUTURE GOALS ============
export const level4Quest: QuestData = {
  levelId: 4,
  title: "Future Goals",
  budget: 30,
  items: [
    { id: "piggy-bank", name: "Piggy bank", cost: 8, icon: "🐷", category: "save", description: "Save for later" },
    { id: "savings-jar", name: "Savings jar", cost: 5, icon: "🏺", category: "save", description: "See your coins grow" },
    { id: "goal-chart", name: "Goal chart", cost: 4, icon: "📊", category: "save", description: "Track progress" },
    { id: "video-game", name: "Video game", cost: 15, icon: "🎮", category: "want", description: "Fun but pricey" },
    { id: "skateboard", name: "Skateboard", cost: 20, icon: "🛹", category: "want", description: "Cool rides" },
    { id: "headphones", name: "Headphones", cost: 12, icon: "🎧", category: "want", description: "Music time" },
  ],
  slotConfig: {
    slot1: { label: "Save 1", category: "save" },
    slot2: { label: "Save 2", category: "save" },
    slot3: { label: "Goal", category: "want" },
  },
  introLines: [
    "You got 30 coins for your birthday!",
    "First, pick 2 ways to SAVE some of your money.",
    "Then pick 1 goal item you're saving for!",
  ],
  startButton: "Plan Savings",
  emergency: {
    message: "Your cousin wants to borrow 10 coins. They'll pay back next week.",
    speaker: "COUSIN",
    choices: { option1: "Lend 5 coins instead", option2: "Lend all 10 coins" },
    reactions: { option1: "Smart! Lend only what you can afford to lose.", option2: "That's risky. Only lend what you can afford to lose." },
    correctOption: "option1",
  },
  fee: {
    message: "Bank deposit fee: +1 coin",
    hint: "Even saving has small costs sometimes.",
    failMessage: "Need 1 coin for the fee. Adjust your plan.",
    amount: 1,
  },
  scam: {
    message: "Invest 20 coins now, get 200 coins in one week! Guaranteed!",
    speaker: "💰 QUICK MONEY AD",
    choices: { pay: "Invest now", ask: "Research first" },
    reactions: { pay: "It was fake! Get-rich-quick schemes are scams.", ask: "Great choice! Real investments take time, not one week." },
    rule: "Fast money promises are usually lies.",
  },
  result: {
    questComplete: "Savings Plan Ready!",
    badgeTitle: "Badge Earned",
    badgeName: "🎯 Goal Setter",
    tip: "Save first, spend second, reach goals!",
    returnButton: "Finish planning",
  },
  coachHints: {
    default: "Pick 2 savings tools, then 1 goal.",
    slotMismatch: "Save slots need savings items. Goal slot needs your goal.",
    overBudget: "Over budget! Choose wisely.",
    needMore: "Pick 2 savings items first.",
  },
};

// Get quest data by level ID
export const getQuestByLevel = (levelId: number): QuestData | null => {
  switch (levelId) {
    case 1: return level1Quest;
    case 2: return level2Quest;
    case 3: return level3Quest;
    case 4: return level4Quest;
    default: return null;
  }
};

// Export all quests
export const allQuests: QuestData[] = [level1Quest, level2Quest, level3Quest, level4Quest];
