import React from "react";

interface CoachHintProps {
  text: string;
  avatar?: string;
  variant?: "default" | "warning" | "success";
}

export const CoachHint: React.FC<CoachHintProps> = ({ 
  text, 
  avatar = "👩‍🏫",
  variant = "default" 
}) => {
  return (
    <div className={`coach-hint coach-hint-${variant}`}>
      <div className="coach-avatar" aria-label="Ms. Laila">
        {avatar}
      </div>
      <div className="coach-bubble">{text}</div>
    </div>
  );
};
