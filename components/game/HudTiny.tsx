import React from "react";

interface HudTinyProps {
  coins: number;
  reputation: number;
  questComplete: boolean;
}

export const HudTiny: React.FC<HudTinyProps> = ({ coins, reputation, questComplete }) => {
  const percent = Math.round((reputation / 100) * 100);
  return (
    <div className="hud-tiny">
      <div style={{ fontWeight: "bold" }}>Coins: {coins}</div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: "bold" }}>Rep</div>
        <div className="rep-bar">
          <div className="rep-fill" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
      </div>
      <div style={{ fontWeight: "bold" }}>{questComplete ? "Quest done" : "Quest 0/1"}</div>
    </div>
  );
};
