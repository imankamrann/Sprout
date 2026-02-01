import React, { useEffect, useMemo, useRef, useState } from "react";
import { User } from "../../types";
import { PhaserGame } from "./PhaserGame";
import { DialogueOverlay } from "./DialogueOverlay";
import { QuestPanel } from "./QuestPanel";
import { QuestTracker } from "./QuestTracker";
import { HudTiny } from "./HudTiny";
import { loadPlayerState, savePlayerState, PlayerState } from "../../state/playerState";
import { getQuestByLevel } from "../../data/quests";
import "./phaserGame.css";

type QuestStage = "WORLD" | "DIALOGUE" | "SHOP" | "TWIST" | "CHECKOUT" | "SCAM" | "RESULT";
type SoundType = "click" | "coin" | "success";

// Level titles mapping
const LEVEL_TITLES: Record<number, string> = {
  1: 'Saving Basics',
  2: 'Needs vs Wants',
  3: 'Earn & Spend',
  4: 'Future Goals',
  5: 'Lunch Rush Snack Mix',
};

interface PhaserGameArenaProps {
  user: User;
  levelId: number;
  onUpdateUser: (coinsEarned: number) => void;
  onExit: () => void;
}

export const PhaserGameArena: React.FC<PhaserGameArenaProps> = ({
  user,
  levelId,
  onUpdateUser,
  onExit,
}) => {
  const [player, setPlayer] = useState<PlayerState>(() => ({
    ...loadPlayerState(),
    coins: user.coins,
    streak: user.streak,
  }));
  const [stage, setStage] = useState<QuestStage>("WORLD");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [confettiOn, setConfettiOn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    savePlayerState(player);
  }, [player]);

  const playSound = (type: SoundType) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.frequency.value = 520;
      gain.gain.value = 0.05;
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "coin") {
      osc.frequency.value = 740;
      gain.gain.value = 0.07;
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.12);
    } else {
      osc.frequency.value = 420;
      gain.gain.value = 0.08;
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
      osc.stop(ctx.currentTime + 0.2);
    }
  };

  const updatePlayer = (result: {
    coinsEarned: number;
    avoidedScam: boolean;
    plannedWell: boolean;
  }) => {
    setPlayer((prev) => ({
      coins: Math.max(0, prev.coins + result.coinsEarned),
      quest1Complete: true,
      streak: prev.streak + 1,
    }));

    // Update parent user state
    onUpdateUser(result.coinsEarned);

    setToast(result.plannedWell ? "You planned well!" : "Next time, save a little more.");
    setTimeout(() => setToast(null), 2200);
  };

  const questStageNumber = useMemo(() => {
    switch (stage) {
      case "WORLD":
      case "DIALOGUE":
        return 0;
      case "SHOP":
        return 1;
      case "TWIST":
        return 2;
      case "CHECKOUT":
        return 3;
      case "SCAM":
      case "RESULT":
        return 4;
      default:
        return 0;
    }
  }, [stage]);

  const progressPercent = player.quest1Complete ? 100 : (questStageNumber / 4) * 100;
  const levelTitle = LEVEL_TITLES[levelId] || `Level ${levelId}`;
  const quest = useMemo(() => getQuestByLevel(levelId), [levelId]);

  return (
    <div className="phaser-game-arena min-h-[calc(100vh-5rem)] p-4 md:p-2">
      {/* Header: Back button + Title */}
      <div className="content-header max-w-4xl mx-auto">
        <button className="back-button" onClick={onExit}>
          ←
        </button>
        <div className="content-title">{levelTitle}</div>
      </div>

      {/* Game card */}
      <div className="game-card max-w-xl mx-auto">
        <div className="game-surface">
          {/* <HudTiny
            coins={player.coins}
            questComplete={player.quest1Complete}
          /> */}
          {/* <QuestTracker stage={questStageNumber} total={4} /> */}
          <PhaserGame
            onNpcInteract={() => {
              setDialogueIndex(0);
              setStage("DIALOGUE");
            }}
          />

          {toast && <div className="toast">{toast}</div>}

          {stage === "DIALOGUE" && quest && (
            <div className="overlay-backdrop">
              <DialogueOverlay
                line={quest.introLines[dialogueIndex]}
                step={dialogueIndex}
                totalSteps={quest.introLines.length}
                onNext={() => {
                  playSound("click");
                  setDialogueIndex((prev) => prev + 1);
                }}
                onStart={() => {
                  playSound("click");
                  setStage("SHOP");
                }}
                onClose={() => setStage("WORLD")}
              />
            </div>
          )}

          {stage !== "WORLD" && stage !== "DIALOGUE" && (
            <div className="overlay-backdrop">
              <QuestPanel
                levelId={levelId}
                stage={stage === "SHOP" ? "SHOP" : stage === "TWIST" ? "TWIST" : stage === "CHECKOUT" ? "CHECKOUT" : stage === "SCAM" ? "SCAM" : "RESULT"}
                onStageChange={(next) => {
                  if (next === "RESULT") {
                    setStage("RESULT");
                    setConfettiOn(true);
                    setTimeout(() => setConfettiOn(false), 1000);
                    return;
                  }
                  if (next === "WORLD") {
                    setStage("WORLD");
                    return;
                  }
                  setStage(next as QuestStage);
                }}
                onResult={(result) => {
                  updatePlayer(result);
                  playSound("coin");
                }}
                onPlaySound={playSound}
              />
            </div>
          )}

          {confettiOn && (
            <div className="confetti">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="confetti-piece" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
