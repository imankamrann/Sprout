import React, { useState, useEffect, useCallback } from 'react';
import { User, GridPosition, TileType, NPC } from '../types';
import { GRID_SIZE, INITIAL_MAP, INITIAL_PLAYER_POS, NPCS } from '../constants';
import { StoryOverlay } from './StoryOverlay';

interface GameArenaProps {
  user: User;
  levelId: number;
  onUpdateUser: (xpEarned: number, coinsEarned: number) => void;
  onExit: () => void;
}

// Level titles mapping
const LEVEL_TITLES: Record<number, string> = {
  1: 'Saving Basics',
  2: 'Needs vs Wants',
  3: 'Earn & Spend',
  4: 'Future Goals',
};

export const GameArena: React.FC<GameArenaProps> = ({ user, levelId, onUpdateUser, onExit }) => {
  const [playerPos, setPlayerPos] = useState<GridPosition>(INITIAL_PLAYER_POS);
  const [map] = useState<TileType[][]>(INITIAL_MAP);
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);
  const [completedNpcs, setCompletedNpcs] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);

  // Filter NPCs for this level
  const levelNpcs = NPCS.filter(npc => npc.levelId === levelId);
  const totalExercises = levelNpcs.length;
  const completedExercises = levelNpcs.filter(npc => completedNpcs.has(npc.id)).length;

  const isWalkable = useCallback((x: number, y: number): boolean => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
    const tile = map[y]?.[x];
    return tile !== TileType.WALL;
  }, [map]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activeNpc || feedbackMessage) return;

    let newX = playerPos.x;
    let newY = playerPos.y;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        newY -= 1;
        break;
      case 'ArrowDown':
      case 's':
        newY += 1;
        break;
      case 'ArrowLeft':
      case 'a':
        newX -= 1;
        break;
      case 'ArrowRight':
      case 'd':
        newX += 1;
        break;
      case ' ':
      case 'Enter':
        // Check for NPC interaction
        const nearbyNpc = levelNpcs.find(
          npc =>
            !completedNpcs.has(npc.id) &&
            Math.abs(npc.position.x - playerPos.x) <= 1 &&
            Math.abs(npc.position.y - playerPos.y) <= 1
        );
        if (nearbyNpc) {
          setActiveNpc(nearbyNpc);
        }
        return;
      default:
        return;
    }

    if (isWalkable(newX, newY)) {
      setPlayerPos({ x: newX, y: newY });
    }
  }, [playerPos, activeNpc, feedbackMessage, isWalkable, levelNpcs, completedNpcs]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNpcComplete = (success: boolean, reward: { xp: number, coins: number }) => {
    if (activeNpc) {
      setCompletedNpcs(prev => new Set(prev).add(activeNpc.id));
      
      if (success) {
        onUpdateUser(reward.xp, reward.coins);
        setFeedbackMessage(`+${reward.xp} XP, +${reward.coins} coins!`);
        setFeedbackType('success');
      } else {
        setFeedbackMessage('Try again next time!');
        setFeedbackType('error');
      }
      
      setActiveNpc(null);
      
      setTimeout(() => {
        setFeedbackMessage(null);
        setFeedbackType(null);
      }, 2000);
    }
  };

  const handleNpcClose = () => {
    setActiveNpc(null);
  };

  const renderTile = (x: number, y: number, tileType: TileType) => {
    const isPlayer = playerPos.x === x && playerPos.y === y;
    const npcOnTile = levelNpcs.find(npc => npc.position.x === x && npc.position.y === y);
    const isNpcCompleted = npcOnTile && completedNpcs.has(npcOnTile.id);
    
    // Checkered pattern: alternating light gray and white
    const isLightTile = (x + y) % 2 === 0;
    const bgColor = isLightTile ? 'bg-gray-200' : 'bg-gray-100';

    return (
      <div
        key={`${x}-${y}`}
        className={`aspect-square flex items-center justify-center ${bgColor} relative transition-all duration-150`}
      >
        {/* NPC */}
        {npcOnTile && !isNpcCompleted && !isPlayer && (
          <div className="text-2xl md:text-3xl animate-bounce z-10">
            {npcOnTile.icon}
          </div>
        )}

        {/* Completed NPC marker */}
        {isNpcCompleted && !isPlayer && (
          <div className="text-xl text-green-500 z-10">✓</div>
        )}

        {/* Player */}
        {isPlayer && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-sprout-green shadow-lg flex items-center justify-center text-white font-bold text-xs md:text-sm border-2 border-white">
              🧒
            </div>
          </div>
        )}
      </div>
    );
  };

  const progressPercent = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const levelTitle = LEVEL_TITLES[levelId] || `Level ${levelId}`;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center p-4 md:p-8">
      {/* Header: Back button + Title - Outside container */}
      <div className="w-full max-w-3xl flex items-center gap-4 mb-4">
        <button
          onClick={onExit}
          className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Go back"
        >
          <span className="text-gray-600 text-xl">←</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{levelTitle}</h1>
      </div>

      {/* Main Game Container - White box with rounded corners */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Progress Section - Inside container */}
        <div className="px-6 pt-6 pb-4">
          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-sprout-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Exercise Counter */}
          <p className="text-center text-gray-500 text-sm font-medium">
            Exercise {Math.min(completedExercises + 1, totalExercises)} of {totalExercises}
          </p>
        </div>

        {/* Grid Container */}
        <div className="px-4 pb-4 flex justify-center">
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: 'min(100%, 500px)',
              aspectRatio: '1',
            }}
          >
            {map.map((row, y) =>
              row.map((tile, x) => renderTile(x, y, tile))
            )}
          </div>
        </div>

        {/* Controls hint */}
        <div className="px-6 pb-4">
          <p className="text-center text-gray-400 text-xs">
            Use arrow keys to move • Press Space near characters to talk
          </p>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`fixed top-28 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg font-bold z-50 transition-all ${
            feedbackType === 'success'
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-red-100 text-red-700 border-2 border-red-300'
          }`}
        >
          {feedbackMessage}
        </div>
      )}

      {/* Story Overlay */}
      {activeNpc && (
        <StoryOverlay
          npc={activeNpc}
          onComplete={handleNpcComplete}
          onClose={handleNpcClose}
        />
      )}
    </div>
  );
};
