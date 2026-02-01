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

// Props/decorations for the grid
const GRID_PROPS: Record<string, { emoji: string; style?: string }> = {
  // Shelves with items
  '0-3': { emoji: '🧃', style: 'bg-amber-100 border-2 border-amber-300' },
  '0-5': { emoji: '🍎', style: 'bg-amber-100 border-2 border-amber-300' },
  '9-3': { emoji: '🥤', style: 'bg-amber-100 border-2 border-amber-300' },
  '9-5': { emoji: '🍪', style: 'bg-amber-100 border-2 border-amber-300' },
  // Counter/table
  '4-2': { emoji: '', style: 'bg-amber-200 border-2 border-amber-400 rounded' },
  '5-2': { emoji: '', style: 'bg-amber-200 border-2 border-amber-400 rounded' },
  '6-2': { emoji: '', style: 'bg-amber-200 border-2 border-amber-400 rounded' },
  // Register
  '5-7': { emoji: '🛒', style: 'bg-yellow-100 border-2 border-yellow-300' },
};

export const GameArena: React.FC<GameArenaProps> = ({ user, levelId, onUpdateUser, onExit }) => {
  const [playerPos, setPlayerPos] = useState<GridPosition>(INITIAL_PLAYER_POS);
  const [map] = useState<TileType[][]>(INITIAL_MAP);
  const [activeNpc, setActiveNpc] = useState<NPC | null>(null);
  const [completedNpcs, setCompletedNpcs] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [questStage, setQuestStage] = useState(0);

  // Filter NPCs for this level
  const levelNpcs = NPCS.filter(npc => npc.levelId === levelId);
  const totalExercises = levelNpcs.length;
  const completedExercises = levelNpcs.filter(npc => completedNpcs.has(npc.id)).length;

  // Check if player is near an NPC
  const nearbyNpc = levelNpcs.find(
    npc =>
      !completedNpcs.has(npc.id) &&
      Math.abs(npc.position.x - playerPos.x) <= 1 &&
      Math.abs(npc.position.y - playerPos.y) <= 1
  );

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
      case 'W':
        newY -= 1;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        newY += 1;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        newX -= 1;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        newX += 1;
        break;
      case ' ':
      case 'Enter':
      case 'e':
      case 'E':
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
  }, [playerPos, activeNpc, feedbackMessage, isWalkable, nearbyNpc]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNpcComplete = (success: boolean, reward: { xp: number, coins: number }) => {
    if (activeNpc) {
      setCompletedNpcs(prev => new Set(prev).add(activeNpc.id));
      setQuestStage(prev => prev + 1);
      
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

  // Check if tile is on the border (grass area)
  const isBorderTile = (x: number, y: number): boolean => {
    return x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1;
  };

  // Check if tile is in the inner grass strip
  const isGrassStrip = (x: number, y: number): boolean => {
    return x === 1 || x === GRID_SIZE - 2;
  };

  const renderTile = (x: number, y: number, tileType: TileType) => {
    const isPlayer = playerPos.x === x && playerPos.y === y;
    const npcOnTile = levelNpcs.find(npc => npc.position.x === x && npc.position.y === y);
    const isNpcCompleted = npcOnTile && completedNpcs.has(npcOnTile.id);
    const propKey = `${x}-${y}`;
    const prop = GRID_PROPS[propKey];
    
    // Determine tile background
    let bgClass = '';
    if (isBorderTile(x, y)) {
      // Outer grass border - darker green with checkered pattern
      const isLightGrass = (x + y) % 2 === 0;
      bgClass = isLightGrass ? 'bg-green-400' : 'bg-green-500';
    } else if (isGrassStrip(x, y)) {
      // Inner grass strip - lighter green
      const isLightGrass = (x + y) % 2 === 0;
      bgClass = isLightGrass ? 'bg-green-300' : 'bg-green-400';
    } else {
      // Floor - checkered gray pattern
      const isLightTile = (x + y) % 2 === 0;
      bgClass = isLightTile ? 'bg-gray-200' : 'bg-slate-200';
    }

    // Add horizontal stripe pattern for floor tiles (like in reference)
    const hasStripe = !isBorderTile(x, y) && !isGrassStrip(x, y) && y % 3 === 0;

    return (
      <div
        key={`${x}-${y}`}
        className={`aspect-square flex items-center justify-center relative transition-all duration-100 ${bgClass} ${prop?.style || ''}`}
      >
        {/* Stripe overlay */}
        {hasStripe && (
          <div className="absolute inset-x-0 top-1/2 h-[2px] bg-gray-300/50 transform -translate-y-1/2" />
        )}

        {/* Prop */}
        {prop?.emoji && !isPlayer && (
          <div className="text-lg md:text-xl z-5">{prop.emoji}</div>
        )}

        {/* NPC */}
        {npcOnTile && !isNpcCompleted && !isPlayer && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-orange-400 flex items-center justify-center text-lg md:text-xl shadow-md border-2 border-orange-300">
              {npcOnTile.icon}
            </div>
          </div>
        )}

        {/* Completed NPC marker */}
        {isNpcCompleted && !isPlayer && (
          <div className="text-lg text-green-600 font-bold z-10">✓</div>
        )}

        {/* Player */}
        {isPlayer && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            {/* "Press E" hint */}
            {nearbyNpc && nearbyNpc.position.x === x && nearbyNpc.position.y === y ? null : nearbyNpc && (
              <div className="absolute -top-6 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 shadow-sm border whitespace-nowrap">
                Press E
              </div>
            )}
            {/* Player character */}
            <div className="w-6 h-8 md:w-7 md:h-9 rounded-full bg-green-600 flex items-center justify-center shadow-lg border-2 border-green-400">
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-amber-200 border border-amber-300" />
            </div>
            {/* Player shadow */}
            <div className="w-4 h-1 bg-black/20 rounded-full mt-0.5" />
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

      {/* Progress bar container - Outside game area */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-sprout-green rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-center text-gray-500 text-sm font-medium">
          Quest {Math.min(completedExercises + 1, totalExercises)} of {totalExercises}
        </p>
      </div>

      {/* Main Game Container */}
      <div className="w-full max-w-3xl bg-gray-300 rounded-2xl shadow-lg overflow-hidden border-4 border-gray-400">
        {/* In-game HUD */}
        <div className="bg-gray-200/90 px-4 py-2 flex items-center justify-between text-sm border-b-2 border-gray-300">
          <div className="flex items-center gap-4">
            {/* Coins */}
            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg shadow-sm">
              <span className="text-gray-700 font-semibold">Coins:</span>
              <span className="font-bold text-yellow-600">{user.coins}</span>
            </div>
            {/* Rep bar */}
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
              <span className="text-gray-500 text-xs font-medium">Rep</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-sprout-green rounded-full" style={{ width: `${Math.min(100, (user.xp % 100))}%` }} />
              </div>
            </div>
          </div>
          <div className="text-gray-600 font-medium">
            {completedExercises === totalExercises ? (
              <span className="text-green-600">✓ Quest done</span>
            ) : (
              <span>Stage {questStage} / {totalExercises}</span>
            )}
          </div>
        </div>

        {/* Quest info panel */}
        <div className="bg-gray-100/80 px-4 py-2 border-b border-gray-300">
          <p className="text-gray-700 font-semibold text-sm">Quest: {levelTitle}</p>
          <p className="text-gray-500 text-xs">Stage {questStage} / {totalExercises}</p>
        </div>

        {/* Grid Container */}
        <div className="p-2 flex justify-center bg-gradient-to-b from-gray-300 to-gray-400">
          <div
            className="grid gap-0 rounded-lg overflow-hidden shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: 'min(100%, 480px)',
              aspectRatio: '1',
            }}
          >
            {map.map((row, y) =>
              row.map((tile, x) => renderTile(x, y, tile))
            )}
          </div>
        </div>

        {/* Controls hint */}
        <div className="bg-gray-200/90 px-4 py-2 border-t-2 border-gray-300">
          <p className="text-center text-gray-500 text-xs">
            Arrow keys or WASD to move • Press E or Space near characters to interact
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
