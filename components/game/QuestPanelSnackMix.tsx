import React, { useEffect, useMemo, useState } from "react";
import { snackItems, SnackItem, SnackCategory, questCopy } from "../../data/questSnackMix";
import { CoachHint } from "./CoachHint";
import coinIcon from "../../assets/Coin.svg";

interface QuestPanelSnackMixProps {
  stage: "SHOP" | "TWIST" | "CHECKOUT" | "SCAM" | "RESULT";
  onStageChange: (stage: QuestPanelSnackMixProps["stage"] | "WORLD") => void;
  onResult: (result: {
    coinsLeft: number;
    xpGained: number;
    avoidedScam: boolean;
    plannedWell: boolean;
  }) => void;
  onPlaySound: (type: "click" | "coin" | "success") => void;
}

type SlotId = "fuel1" | "fuel2" | "treat";

type SlotState = {
  fuel1: SnackItem | null;
  fuel2: SnackItem | null;
  treat: SnackItem | null;
};

export const QuestPanelSnackMix: React.FC<QuestPanelSnackMixProps> = ({
  stage,
  onStageChange,
  onResult,
  onPlaySound,
}) => {
  const items = useMemo(() => snackItems, []);
  const [category, setCategory] = useState<SnackCategory>("fuel");
  const [backpack, setBackpack] = useState<SnackItem[]>([]);
  const [selectedBackpack, setSelectedBackpack] = useState<number | null>(null);
  const [slots, setSlots] = useState<SlotState>({ fuel1: null, fuel2: null, treat: null });
  const [message, setMessage] = useState<string | null>(null);
  const [coachMessage, setCoachMessage] = useState<string | null>(null);
  const [twistShown, setTwistShown] = useState(false);
  const [scamChoice, setScamChoice] = useState<"pay" | "ask" | null>(null);
  const [twistChoice, setTwistChoice] = useState<"fuel" | "treat" | null>(null);
  const [feeAcknowledged, setFeeAcknowledged] = useState(false);

  const visibleItems = items.filter((item) => item.category === category).slice(0, 3);

  const allChosen = [...backpack, slots.fuel1, slots.fuel2, slots.treat].filter(Boolean) as SnackItem[];
  const total = allChosen.reduce((sum, item) => sum + item.cost, 0);
  const coinsLeft = 20 - total;
  const totalWithFee = total + 2;
  const finalCoinsLeft = Math.max(0, 20 - totalWithFee);

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

  const addToBackpack = (item: SnackItem) => {
    if (coinsLeft - item.cost < 0) {
      setMessage(questCopy.coachHints.overBudget);
      return;
    }
    const fuelCount = [slots.fuel1, slots.fuel2].filter(Boolean).length;
    if (item.category === "treat" && fuelCount < 2) {
      showCoach(questCopy.coachHints.fuelFirst);
    }
    onPlaySound("click");
    setMessage(null);
    setBackpack((prev) => [...prev, item]);
  };

  const placeIntoSlot = (slot: SlotId) => {
    if (selectedBackpack === null) return;
    const item = backpack[selectedBackpack];
    if (!item) return;

    const requiresFuel = slot === "fuel1" || slot === "fuel2";
    if (requiresFuel && item.category !== "fuel") {
      setMessage("Fuel slots need Fuel snacks.");
      showCoach(questCopy.coachHints.slotMismatch);
      return;
    }
    if (slot === "treat" && item.category !== "treat") {
      setMessage("Treat slot needs Treat snacks.");
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
    if (!slots.fuel1 || !slots.fuel2) {
      setMessage(questCopy.coachHints.needTwoFuel);
      showCoach(questCopy.coachHints.fuelFirst);
      return;
    }
    if (coinsLeft < 0) {
      setMessage(questCopy.coachHints.overBudget);
      return;
    }
    onStageChange("CHECKOUT");
  };

  const applyFee = () => {
    if (totalWithFee > 20) {
      setMessage(questCopy.fee.failMessage);
      showCoach(questCopy.fee.hint);
      setFeeAcknowledged(false);
      onStageChange("SHOP");
      return;
    }
    onPlaySound("click");
    onStageChange("SCAM");
  };

  const handleTwist = (choice: "fuel" | "treat") => {
    setTwistChoice(choice);
    if (choice === "fuel") {
      setMessage(questCopy.emergency.reactions.fuel);
    } else {
      setMessage(questCopy.emergency.reactions.treat);
      showCoach(questCopy.coachHints.fuelFirst);
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
    if (choice === "pay") {
      setMessage(questCopy.scam.reactions.pay);
    } else {
      setMessage(questCopy.scam.reactions.ask);
    }
  };

  const finishQuest = () => {
    const avoidedScam = scamChoice !== "pay";
    const xpGained = 10 + Math.max(0, finalCoinsLeft * 2) + (avoidedScam ? 5 : 0);
    const plannedWell = finalCoinsLeft >= 2 && avoidedScam;

    onPlaySound("success");
    onResult({
      coinsLeft: finalCoinsLeft,
      xpGained,
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
        <div className="speaker-pill">{questCopy.emergency.speaker}</div>
        <div className="speech-bubble speech-bubble-large">
          {questCopy.emergency.message}
        </div>
        {!twistChoice ? (
          <div className="choice-stack">
            <button className="choice-btn choice-btn-fuel" onClick={() => handleTwist("fuel")}>
              🍎 {questCopy.emergency.choices.fuel}
            </button>
            <button className="choice-btn choice-btn-treat" onClick={() => handleTwist("treat")}>
              🍬 {questCopy.emergency.choices.treat}
            </button>
          </div>
        ) : (
          <div className="reaction-card">
            <div className="reaction-icon">{twistChoice === "fuel" ? "✅" : "💭"}</div>
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
        <CoachHint text={questCopy.fee.hint} avatar="👩‍🏫" />
        
        <div className="fee-breakdown">
          <div className="fee-row">
            <span>Snacks total:</span>
            <span className="fee-amount">{total} coins</span>
          </div>
          <div className="fee-row fee-row-highlight">
            <span>⚠️ {questCopy.fee.message}</span>
            <span className="fee-amount">+2 coins</span>
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
        <div className="speaker-pill scam-speaker">{questCopy.scam.speaker}</div>
        <div className="speech-bubble speech-bubble-scam">
          💰 {questCopy.scam.message}
        </div>
        
        {!scamChoice ? (
          <div className="choice-stack">
            <button className="choice-btn choice-btn-danger" onClick={() => handleScam("pay")}>
              💸 {questCopy.scam.choices.pay}
            </button>
            <button className="choice-btn choice-btn-safe" onClick={() => handleScam("ask")}>
              🙋 {questCopy.scam.choices.ask}
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
              <div className="rule-text">{questCopy.scam.rule}</div>
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
    const xpGained = 10 + Math.max(0, finalCoinsLeft * 2) + (avoidedScam ? 5 : 0);
    const plannedWell = finalCoinsLeft >= 2 && avoidedScam;
    
    return (
      <div className="quest-card quest-card-result">
        <div className="result-confetti">🎉</div>
        <div className="quest-header quest-header-result">
          {questCopy.result.questComplete}
        </div>
        
        <div className="badge-display">
          <div className="badge-icon">{questCopy.result.badgeName}</div>
          <div className="badge-label">{questCopy.result.badgeTitle}</div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value"><img src={coinIcon} alt="Coins" className="inline-coin" /> {finalCoinsLeft}</div>
            <div className="stat-label">{questCopy.result.stats.coinsLeft}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">⭐ +{xpGained}</div>
            <div className="stat-label">{questCopy.result.stats.xpEarned}</div>
          </div>
        </div>
        
        <div className="tip-card">
          <div className="tip-icon">💡</div>
          <div className="tip-text">{questCopy.result.tip}</div>
        </div>
        
        <button className="confirm-btn confirm-btn-large confirm-btn-success" onClick={() => onStageChange("WORLD")}>
          {questCopy.result.returnButton}
        </button>
      </div>
    );
  }

  // ========== SHOP STAGE: Main Shopping Interface ==========
  return (
    <div className="quest-card">
      <CoachHint 
        text={coachMessage || questCopy.coachHints.default} 
        avatar="👩‍🏫"
      />
      
      <div className="quest-header">
        <span className="quest-icon">🛒</span>
        Lunch Rush Snack Mix
      </div>
      
      <div className="budget-display">
        <div className="budget-coin"><img src={coinIcon} alt="Coins" /></div>
        <div className="budget-amount">{coinsLeft}</div>
        <div className="budget-label">coins left</div>
        {coinsLeft < 2 && <div className="budget-warning">⚠️ Save some!</div>}
      </div>

      <div className="category-tabs">
        <button 
          className={`category-tab ${category === "fuel" ? "active fuel" : ""}`} 
          onClick={() => { setCategory("fuel"); onPlaySound("click"); }}
        >
          🍎 Fuel Snacks
          <span className="category-hint">Healthy</span>
        </button>
        <button 
          className={`category-tab ${category === "treat" ? "active treat" : ""}`} 
          onClick={() => { setCategory("treat"); onPlaySound("click"); }}
        >
          🍬 Treat Snacks
          <span className="category-hint">Yummy</span>
        </button>
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
            <div className="item-cost">{item.cost} <img src={coinIcon} alt="Coins" className="inline-coin" /></div>
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
            <span className="backpack-empty">Tap snacks to add them here</span>
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
          <div className="backpack-hint">Tap a slot below to place the snack</div>
        )}
      </div>

      <div className="shelf-slots">
        <div className="shelf-label">📦 Shelf</div>
        <div className="slot-row">
          <button 
            className={`slot fuel ${slots.fuel1 ? "filled" : ""} ${selectedBackpack !== null ? "ready" : ""}`} 
            onClick={() => slots.fuel1 ? removeFromSlot("fuel1") : placeIntoSlot("fuel1")}
          >
            <span className="slot-label">Fuel 1</span>
            {slots.fuel1 && (
              <span className="slot-item">{slots.fuel1.icon} {slots.fuel1.name}</span>
            )}
          </button>
          <button 
            className={`slot fuel ${slots.fuel2 ? "filled" : ""} ${selectedBackpack !== null ? "ready" : ""}`} 
            onClick={() => slots.fuel2 ? removeFromSlot("fuel2") : placeIntoSlot("fuel2")}
          >
            <span className="slot-label">Fuel 2</span>
            {slots.fuel2 && (
              <span className="slot-item">{slots.fuel2.icon} {slots.fuel2.name}</span>
            )}
          </button>
          <button 
            className={`slot treat ${slots.treat ? "filled" : ""} ${selectedBackpack !== null ? "ready" : ""}`} 
            onClick={() => slots.treat ? removeFromSlot("treat") : placeIntoSlot("treat")}
          >
            <span className="slot-label">Treat</span>
            {slots.treat && (
              <span className="slot-item">{slots.treat.icon} {slots.treat.name}</span>
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
        className={`checkout-btn ${slots.fuel1 && slots.fuel2 ? "ready" : "disabled"}`} 
        onClick={startCheckout}
        disabled={!slots.fuel1 || !slots.fuel2}
      >
        🛒 Checkout
      </button>
    </div>
  );
};
