import React, { useEffect, useMemo, useState } from "react";
import { getQuestByLevel, QuestData, QuestItem, ItemCategory } from "../../data/quests";
import { CoachHint } from "./CoachHint";

interface QuestPanelProps {
  levelId: number;
  stage: "SHOP" | "TWIST" | "CHECKOUT" | "SCAM" | "RESULT";
  onStageChange: (stage: QuestPanelProps["stage"] | "WORLD") => void;
  onResult: (result: {
    coinsEarned: number;
    avoidedScam: boolean;
    plannedWell: boolean;
  }) => void;
  onPlaySound: (type: "click" | "coin" | "success") => void;
}

type SlotId = "slot1" | "slot2" | "slot3";

type SlotState = {
  slot1: QuestItem | null;
  slot2: QuestItem | null;
  slot3: QuestItem | null;
};

export const QuestPanel: React.FC<QuestPanelProps> = ({
  levelId,
  stage,
  onStageChange,
  onResult,
  onPlaySound,
}) => {
  const quest = useMemo(() => getQuestByLevel(levelId), [levelId]);
  
  // Fallback if quest not found
  if (!quest) {
    return (
      <div className="quest-card">
        <div className="quest-header">Quest not found for level {levelId}</div>
        <button className="confirm-btn" onClick={() => onStageChange("WORLD")}>Go Back</button>
      </div>
    );
  }

  const items = quest.items;
  const categories = [...new Set(items.map(i => i.category))];
  const [category, setCategory] = useState<ItemCategory>(categories[0] || "need");
  const [backpack, setBackpack] = useState<QuestItem[]>([]);
  const [selectedBackpack, setSelectedBackpack] = useState<number | null>(null);
  const [slots, setSlots] = useState<SlotState>({ slot1: null, slot2: null, slot3: null });
  const [message, setMessage] = useState<string | null>(null);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [twistShown, setTwistShown] = useState(false);
  const [scamChoice, setScamChoice] = useState<"pay" | "ask" | null>(null);
  const [twistChoice, setTwistChoice] = useState<"option1" | "option2" | null>(null);
  const [feeAcknowledged, setFeeAcknowledged] = useState(false);

  const visibleItems = items.filter((item) => item.category === category).slice(0, 3);

  const allChosen = [...backpack, slots.slot1, slots.slot2, slots.slot3].filter(Boolean) as QuestItem[];
  const total = allChosen.reduce((sum, item) => sum + item.cost, 0);
  const coinsLeft = quest.budget - total;
  const totalWithFee = total + quest.fee.amount;
  const finalCoinsLeft = Math.max(0, quest.budget - totalWithFee);

  // Trigger emergency twist after first item is picked
  useEffect(() => {
    if (stage !== "SHOP" || twistShown) return;
    if (allChosen.length >= 1) {
      setTwistShown(true);
      onStageChange("TWIST");
    }
  }, [stage, twistShown, allChosen.length, onStageChange]);

  const showCoach = (text: string) => {
    setCoachMessage(text);
    setTimeout(() => setCoachMessage(null), 2200);
  };

  const getCategoryLabel = (cat: ItemCategory): string => {
    switch (cat) {
      case "need": return "Needs";
      case "want": return "Wants";
      case "earn": return "Supplies";
      case "save": return "Savings";
      default: return cat;
    }
  };

  const getCategoryIcon = (cat: ItemCategory): string => {
    switch (cat) {
      case "need": return "📦";
      case "want": return "⭐";
      case "earn": return "💼";
      case "save": return "🐷";
      default: return "📦";
    }
  };

  const addToBackpack = (item: QuestItem) => {
    if (coinsLeft - item.cost < 0) {
      setMessage(quest.coachHints.overBudget);
      return;
    }
    const slot1Cat = quest.slotConfig.slot1.category;
    const slot2Cat = quest.slotConfig.slot2.category;
    const slot1Filled = slots.slot1 !== null;
    const slot2Filled = slots.slot2 !== null;
    
    // Check if trying to pick slot3 category before filling slots 1 and 2
    if (item.category === quest.slotConfig.slot3.category && (!slot1Filled || !slot2Filled)) {
      showCoach(quest.coachHints.needMore);
    }
    
    onPlaySound("click");
    setMessage(null);
    setBackpack((prev) => [...prev, item]);
  };

  const removeFromBackpack = (index: number) => {
    setBackpack((prev) => prev.filter((_, i) => i !== index));
    setSelectedBackpack(null);
    setMessage(null);
    onPlaySound("click");
  };

  const placeIntoSlot = (slot: SlotId) => {
    if (selectedBackpack === null) return;
    const item = backpack[selectedBackpack];
    if (!item) return;

    const slotConfig = quest.slotConfig[slot];
    if (item.category !== slotConfig.category) {
      setMessage(`${slotConfig.label} needs ${getCategoryLabel(slotConfig.category)} items.`);
      showCoach(quest.coachHints.slotMismatch);
      return;
    }

    const updatedBackpack = backpack.filter((_, index) => index !== selectedBackpack);
    setBackpack(updatedBackpack);
    setSelectedBackpack(null);
    setSlots((prev) => ({ ...prev, [slot]: item }));
    onPlaySound("click");
  };

  const removeFromSlot = (slot: SlotId) => {
    const item = slots[slot];
    if (!item) return;
    setSlots((prev) => ({ ...prev, [slot]: null }));
    setBackpack((prev) => [...prev, item]);
    onPlaySound("click");
  };

  const startCheckout = () => {
    if (!slots.slot1 || !slots.slot2) {
      setMessage(quest.coachHints.needMore);
      showCoach(quest.coachHints.default);
      return;
    }
    if (coinsLeft < 0) {
      setMessage(quest.coachHints.overBudget);
      return;
    }
    onStageChange("CHECKOUT");
  };

  const applyFee = () => {
    if (totalWithFee > quest.budget) {
      setMessage(quest.fee.failMessage);
      showCoach(quest.fee.hint);
      setFeeAcknowledged(false);
      onStageChange("SHOP");
      return;
    }
    onPlaySound("click");
    onStageChange("SCAM");
  };

  const handleTwist = (choice: "option1" | "option2") => {
    setTwistChoice(choice);
    setMessage(quest.emergency.reactions[choice]);
    if (choice !== quest.emergency.correctOption) {
      showCoach(quest.coachHints.default);
    }
    onPlaySound("click");
    setTimeout(() => {
      setMessage(null);
      onStageChange("SHOP");
    }, 2000);
  };

  const handleScam = (choice: "pay" | "ask") => {
    setScamChoice(choice);
    onPlaySound("click");
    setMessage(quest.scam.reactions[choice]);
  };

  const finishQuest = () => {
    const avoidedScam = scamChoice !== "pay";
    const coinsEarned = Math.max(0, finalCoinsLeft) + (avoidedScam ? 5 : 0);
    const plannedWell = finalCoinsLeft >= 2 && avoidedScam;

    onPlaySound("success");
    onResult({
      coinsEarned,
      avoidedScam,
      plannedWell,
    });
    onStageChange("RESULT");
  };

  // ========== TWIST STAGE: Emergency Request ==========
  if (stage === "TWIST") {
    return (
      <div className="quest-card quest-card-compact">
        <div className="quest-header">
          <span className="quest-icon">🚨</span>
          Surprise!
        </div>
        <div className="speaker-pill">{quest.emergency.speaker}</div>
        <div className="speech-bubble speech-bubble-large">
          {quest.emergency.message}
        </div>
        {!twistChoice ? (
          <div className="choice-stack">
            <button className="choice-btn choice-btn-fuel" onClick={() => handleTwist("option1")}>
              ✅ {quest.emergency.choices.option1}
            </button>
            <button className="choice-btn choice-btn-treat" onClick={() => handleTwist("option2")}>
              ❓ {quest.emergency.choices.option2}
            </button>
          </div>
        ) : (
          <div className="reaction-card">
            <div className="reaction-icon">{twistChoice === quest.emergency.correctOption ? "✅" : "💭"}</div>
            <div className="reaction-text">{message}</div>
          </div>
        )}
      </div>
    );
  }

  // ========== CHECKOUT STAGE: Fee Reveal ==========
  if (stage === "CHECKOUT") {
    return (
      <div className="quest-card quest-card-compact">
        <div className="quest-header">
          <span className="quest-icon">🧾</span>
          Checkout
        </div>
        <CoachHint text={quest.fee.hint} avatar="👩‍🏫" />
        
        <div className="fee-breakdown">
          <div className="fee-row">
            <span>Items total:</span>
            <span className="fee-amount">{total} coins</span>
          </div>
          <div className="fee-row fee-row-highlight">
            <span>⚠️ {quest.fee.message}</span>
            <span className="fee-amount">+{quest.fee.amount} coins</span>
          </div>
          <div className="fee-row fee-row-total">
            <span>Total:</span>
            <span className="fee-amount">{totalWithFee} coins</span>
          </div>
          <div className="fee-row">
            <span>Coins left:</span>
            <span className={`fee-amount ${finalCoinsLeft < 2 ? "text-danger" : "text-success"}`}>
              {finalCoinsLeft} coins
            </span>
          </div>
        </div>
        
        <button className="confirm-btn confirm-btn-large" onClick={applyFee}>
          Continue to Pay
        </button>
      </div>
    );
  }

  // ========== SCAM STAGE: Scam Alert ==========
  if (stage === "SCAM") {
    return (
      <div className="quest-card quest-card-compact">
        <div className="quest-header">
          <span className="quest-icon">📱</span>
          Mystery Message!
        </div>
        <div className="speaker-pill scam-speaker">{quest.scam.speaker}</div>
        <div className="speech-bubble speech-bubble-scam">
          💰 {quest.scam.message}
        </div>
        
        {!scamChoice ? (
          <div className="choice-stack">
            <button className="choice-btn choice-btn-danger" onClick={() => handleScam("pay")}>
              💸 {quest.scam.choices.pay}
            </button>
            <button className="choice-btn choice-btn-safe" onClick={() => handleScam("ask")}>
              🙋 {quest.scam.choices.ask}
            </button>
          </div>
        ) : (
          <>
            <div className={`reaction-card ${scamChoice === "ask" ? "reaction-success" : "reaction-warning"}`}>
              <div className="reaction-icon">{scamChoice === "ask" ? "✅" : "⚠️"}</div>
              <div className="reaction-text">{message}</div>
            </div>
            <div className="rule-card">
              <div className="rule-icon">🛡️</div>
              <div className="rule-text">{quest.scam.rule}</div>
            </div>
            <button className="confirm-btn confirm-btn-large" onClick={finishQuest}>
              See Results
            </button>
          </>
        )}
      </div>
    );
  }

  // ========== RESULT STAGE: Quest Complete ==========
  if (stage === "RESULT") {
    const avoidedScam = scamChoice !== "pay";
    const coinsEarned = Math.max(0, finalCoinsLeft) + (avoidedScam ? 5 : 0);
    
    return (
      <div className="quest-card quest-card-result">
        <div className="result-confetti">🎉</div>
        <div className="quest-header quest-header-result">
          {quest.result.questComplete}
        </div>
        
        <div className="badge-display">
          <div className="badge-icon">{quest.result.badgeName}</div>
          <div className="badge-label">{quest.result.badgeTitle}</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">🪙 +{coinsEarned}</div>
            <div className="stat-label">Coins earned</div>
          </div>
        </div>
        
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <div className="tip-text">{quest.result.tip}</div>
        </div>
        
        <button className="confirm-btn confirm-btn-large confirm-btn-success" onClick={() => onStageChange("WORLD")}>
          {quest.result.returnButton}
        </button>
      </div>
    );
  }

  // Get unique categories for tabs
  const uniqueCategories = [...new Set(items.map(i => i.category))];

  // ========== SHOP STAGE: Main Shopping Interface ==========
  return (
    <div className="quest-card">
      <CoachHint 
        text={coachMessage || quest.coachHints.default} 
        avatar="👩‍🏫"
      />
      
      <div className="quest-header">
        <span className="quest-icon">🛒</span>
        {quest.title}
      </div>
      
      <div className="budget-display">
        <div className="budget-coin">🪙</div>
        <div className="budget-amount">{coinsLeft}</div>
        <div className="budget-label">coins left</div>
        {coinsLeft < 2 && <div className="budget-warning">⚠️ Save some!</div>}
      </div>

      <div className="category-tabs">
        {uniqueCategories.map((cat) => (
          <button 
            key={cat}
            className={`category-tab ${category === cat ? `active ${cat}` : ""}`} 
            onClick={() => { setCategory(cat); onPlaySound("click"); }}
          >
            {getCategoryIcon(cat)} {getCategoryLabel(cat)}
            <span className="category-hint">{cat === "need" || cat === "save" ? "Important" : "Fun"}</span>
          </button>
        ))}
      </div>

      <div className="item-grid">
        {visibleItems.map((item) => (
          <button 
            key={item.id} 
            className={`item-card ${item.category}`}
            onClick={() => addToBackpack(item)}
          >
            <div className="item-icon">{item.icon}</div>
            <div className="item-name">{item.name}</div>
            <div className="item-cost">{item.cost} 🪙</div>
          </button>
        ))}
      </div>

      <div className="backpack-section">
        <div className="backpack-header">
          <span className="backpack-icon">🎒</span>
          <span className="backpack-title">Backpack</span>
          {backpack.length > 0 && <span className="backpack-count">{backpack.length}</span>}
        </div>
        <div className="backpack-items">
          {backpack.length === 0 && (
            <span className="backpack-empty">Tap items to add them here</span>
          )}
          {backpack.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              className={`backpack-chip ${item.category} ${selectedBackpack === index ? "selected" : ""}`}
              onClick={() => setSelectedBackpack(selectedBackpack === index ? null : index)}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>
        {selectedBackpack !== null && (
          <div className="backpack-actions">
            <span className="backpack-hint">Tap a slot to place, or</span>
            <button 
              className="remove-btn"
              onClick={() => removeFromBackpack(selectedBackpack)}
            >
              ❌ Remove & Refund
            </button>
          </div>
        )}
      </div>

      <div className="shelf-slots">
        <div className="shelf-label">📦 Your Choices</div>
        <div className="slot-row">
          <button 
            className={`slot ${quest.slotConfig.slot1.category} ${slots.slot1 ? "filled" : ""} ${selectedBackpack !== null ? "ready" : ""}`} 
            onClick={() => slots.slot1 ? removeFromSlot("slot1") : placeIntoSlot("slot1")}
          >
            <span className="slot-label">{quest.slotConfig.slot1.label}</span>
            {slots.slot1 && (
              <span className="slot-item">{slots.slot1.icon} {slots.slot1.name}</span>
            )}
          </button>
          <button 
            className={`slot ${quest.slotConfig.slot2.category} ${slots.slot2 ? "filled" : ""} ${selectedBackpack !== null ? "ready" : ""}`} 
            onClick={() => slots.slot2 ? removeFromSlot("slot2") : placeIntoSlot("slot2")}
          >
            <span className="slot-label">{quest.slotConfig.slot2.label}</span>
            {slots.slot2 && (
              <span className="slot-item">{slots.slot2.icon} {slots.slot2.name}</span>
            )}
          </button>
          <button 
            className={`slot ${quest.slotConfig.slot3.category} ${slots.slot3 ? "filled" : ""} ${selectedBackpack !== null ? "ready" : ""}`} 
            onClick={() => slots.slot3 ? removeFromSlot("slot3") : placeIntoSlot("slot3")}
          >
            <span className="slot-label">{quest.slotConfig.slot3.label}</span>
            {slots.slot3 && (
              <span className="slot-item">{slots.slot3.icon} {slots.slot3.name}</span>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className="message-toast">
          <span className="message-icon">💬</span>
          {message}
        </div>
      )}

      <button 
        className={`checkout-btn ${slots.slot1 && slots.slot2 ? "ready" : "disabled"}`} 
        onClick={startCheckout}
        disabled={!slots.slot1 || !slots.slot2}
      >
        🛒 Checkout
      </button>
    </div>
  );
};
