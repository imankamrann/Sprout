import React from "react";

interface HudTinyProps {
  coins: number;
  questComplete: boolean;
}

export const HudTiny: React.FC<HudTinyProps> = ({ coins, questComplete }) => {
  return (
    <div className="hud-tiny">
      <div style={{ fontWeight: "bold" }}>Coins: {coins}</div>
      <div style={{ fontWeight: "bold" }}>{questComplete ? "Quest done" : "Quest 0/1"}</div>
    </div>
  );
};
