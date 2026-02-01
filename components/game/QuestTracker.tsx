import React from "react";

interface QuestTrackerProps {
  stage: number;
  total: number;
}

export const QuestTracker: React.FC<QuestTrackerProps> = ({ stage, total }) => {
  return (
    <div className="quest-tracker">
      <div className="quest-title">Quest: Restock the shelf</div>
      <div className="quest-progress">
        Stage {stage} / {total}
      </div>
    </div>
  );
};
