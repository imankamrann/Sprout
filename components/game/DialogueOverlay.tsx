import React from "react";

interface DialogueOverlayProps {
  line: string;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onStart: () => void;
  onClose: () => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({
  line,
  step,
  totalSteps,
  onNext,
  onStart,
  onClose,
}) => {
  const isLast = step === totalSteps - 1;

  return (
    <div className="dialogue-card">
      <button className="circle-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      
      {/* NPC Avatar */}
      <div className="npc-avatar">
        <div className="npc-avatar-img">👩‍🏫</div>
        <div className="npc-avatar-glow"></div>
      </div>
      
      <div className="name-pill">MS. LAILA</div>
      
      <div className="speech-bubble">
        <SpeakerIcon />
        <div className="dotted-text">{line}</div>
      </div>
      
      <div className="choice-stack">
        {isLast ? (
          <button className="choice-btn choice-btn-primary" onClick={onStart}>
            🚀 Start Restock
          </button>
        ) : (
          <button className="choice-btn" onClick={onNext}>
            Next →
          </button>
        )}
      </div>
      
      <div className="dialogue-progress">
        <div className="progress-dots">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span key={i} className={`progress-dot ${i <= step ? "active" : ""}`} />
          ))}
        </div>
        <span className="progress-text">{step + 1} / {totalSteps}</span>
      </div>
    </div>
  );
};

const SpeakerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="#1CB0F6" stroke="#1CB0F6" strokeWidth="1" />
    <path d="M16 9C17.2 10 17.2 14 16 15" stroke="#1CB0F6" strokeWidth="2" />
  </svg>
);
