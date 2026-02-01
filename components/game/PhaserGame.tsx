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
      width: 390,
      height: 520,
      parent: containerRef.current,
      backgroundColor: "#EAF6FF",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 390,
        height: 520,
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
