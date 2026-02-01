import React, { useState, useEffect, useCallback } from 'react';
import { GRID_SIZE, INITIAL_MAP, INITIAL_PLAYER_POS } from '../constants';
import { GridPosition, TileType, Scenario } from '../types';
import { generateFinancialScenario } from '../services/geminiService';
import { QuizOverlay } from './QuizOverlay';
import { Button } from './Button';

interface GameArenaProps {
  onUpdateUser: (xpEarned: number, coinsEarned: number) => void;
  onExit: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({ onUpdateUser, onExit }) => {
  const [playerPos, setPlayerPos] = useState<GridPosition>(INITIAL_PLAYER_POS);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionAvailable, setInteractionAvailable] = useState(false);

  // Check if tile is walkable
  const isWalkable = (x: number, y: number): boolean => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
    const tile = INITIAL_MAP[y][x];
    return tile === TileType.EMPTY || tile === TileType.START;
  };

  // Check for adjacent shops
  const checkInteraction = useCallback((pos: GridPosition) => {
    const neighbors = [
      { x: pos.x + 1, y: pos.y },
      { x: pos.x - 1, y: pos.y },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x, y: pos.y - 1 },
    ];

    const isNearShop = neighbors.some(n => 
      n.x >= 0 && n.x < GRID_SIZE && n.y >= 0 && n.y < GRID_SIZE && INITIAL_MAP[n.y][n.x] === TileType.SHOP
    );
    
    setInteractionAvailable(isNearShop);
  }, []);

  const handleMove = useCallback((dx: number, dy: number) => {
    if (isQuizOpen || isLoading) return;

    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      
      if (dx > 0) setDirection('right');
      if (dx < 0) setDirection('left');

      if (isWalkable(newX, newY)) {
        const newPos = { x: newX, y: newY };
        checkInteraction(newPos);
        return newPos;
      }
      return prev;
    });
  }, [isQuizOpen, isLoading, checkInteraction]);

  const triggerInteraction = async () => {
    if (!interactionAvailable || isLoading) return;
    
    setIsLoading(true);
    const scenario = await generateFinancialScenario();
    setCurrentScenario(scenario);
    setIsQuizOpen(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp': handleMove(0, -1); break;
        case 'ArrowDown': handleMove(0, 1); break;
        case 'ArrowLeft': handleMove(-1, 0); break;
        case 'ArrowRight': handleMove(1, 0); break;
        case ' ': // Spacebar
        case 'Enter':
          if (interactionAvailable) triggerInteraction();
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, interactionAvailable, isLoading]); // interactionAvailable in deps to trigger correct spacebar action

  const handleQuizComplete = (success: boolean, reward: { xp: number, coins: number }) => {
    if (success) {
      onUpdateUser(reward.xp, reward.coins);
    }
    setTimeout(() => {
        setIsQuizOpen(false);
        setCurrentScenario(null);
    }, 1500); // Give user time to see result
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gray-100">
      
      <div className="mb-4 flex justify-between w-full max-w-lg items-center">
         <Button variant="outline" onClick={onExit} className="py-1 px-4 text-sm">← Exit Level</Button>
         <div className="bg-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
            Use Arrow Keys to Move
         </div>
      </div>

      <div className="relative bg-white p-2 rounded-xl shadow-2xl border-4 border-gray-300">
        <div 
          className="grid relative"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 500px)',
            height: 'min(90vw, 500px)',
          }}
        >
          {/* Render Map */}
          {INITIAL_MAP.map((row, y) => (
            row.map((tile, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`
                  w-full h-full border-[0.5px] border-gray-100
                  ${tile === TileType.WALL ? 'bg-slate-700 shadow-inner' : ''}
                  ${tile === TileType.EMPTY || tile === TileType.START ? ((x+y)%2===0 ? 'bg-white' : 'bg-blue-50') : ''}
                  ${tile === TileType.SHOP ? 'bg-yellow-200 relative' : ''}
                `}
              >
                {tile === TileType.WALL && <div className="w-full h-full opacity-30 bg-black/20"></div>}
                {tile === TileType.SHOP && (
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        🏪
                    </div>
                )}
              </div>
            ))
          ))}

          {/* Player Entity */}
          <div 
            className="absolute transition-all duration-200 ease-out z-10 flex items-center justify-center"
            style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(playerPos.x / GRID_SIZE) * 100}%`,
                top: `${(playerPos.y / GRID_SIZE) * 100}%`,
            }}
          >
              <div className={`text-3xl filter drop-shadow-lg transform transition-transform ${direction === 'left' ? 'scale-x-[-1]' : ''}`}>
                🐼
              </div>
          </div>
        </div>

        {/* Interaction Prompt Overlay */}
        {interactionAvailable && !isQuizOpen && (
             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <Button 
                    onClick={triggerInteraction} 
                    variant="primary" 
                    className="animate-bounce shadow-xl"
                >
                    {isLoading ? 'Loading...' : 'PRESS SPACE TO SHOP'}
                </Button>
             </div>
        )}
      </div>

      {isQuizOpen && currentScenario && (
        <QuizOverlay 
          scenario={currentScenario} 
          onComplete={handleQuizComplete}
          onClose={() => setIsQuizOpen(false)}
        />
      )}
    </div>
  );
};