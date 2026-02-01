import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { StoreScene } from "./StoreScene";

interface PhaserGameProps {
  onNpcInteract: () => void;
}

export const PhaserGame: React.FC<PhaserGameProps> = ({ onNpcInteract }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onNpcInteractRef = useRef(onNpcInteract);

  useEffect(() => {
    onNpcInteractRef.current = onNpcInteract;
  }, [onNpcInteract]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new StoreScene(() => onNpcInteractRef.current());
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 600,
      height: 680,
      parent: containerRef.current,
      backgroundColor: "#EAF6FF",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 600,
        height: 680,
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
        },
      },
      scene: [scene],
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div className="phaser-container" ref={containerRef} />;
};
