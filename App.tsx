import React, { useState } from 'react';
import { User } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GameArena } from './components/GameArena';
import { PhaserGameArena } from './components/game/PhaserGameArena';
import { AuthScreen } from './components/AuthScreen';

// Levels that use the Phaser-based game arena (store/shopping quests)
const PHASER_LEVELS = [1, 2, 3, 4];

const MOCK_USER: User = {
  username: 'Guest',
  email: '',
  coins: 0,
  streak: 0,
  completedLevels: []
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'game'>('dashboard');
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const handleLogin = (username: string) => {
    setUser({ ...MOCK_USER, username });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleSelectLevel = (levelId: number) => {
    setActiveLevel(levelId);
    setCurrentView('game');
  };

  const handleExitLevel = () => {
    setActiveLevel(null);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (coinsEarned: number) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      // If we finished a level, mark it as completed
      const newCompletedLevels = activeLevel && !prev.completedLevels.includes(activeLevel) 
        ? [...prev.completedLevels, activeLevel] 
        : prev.completedLevels;

      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        completedLevels: newCompletedLevels
      };
    });
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-sprout-bg text-gray-800 font-sans">
      <Navbar user={user} onLogout={handleLogout} onHome={handleExitLevel} />
      
      <main className="pt-20">
        {currentView === 'dashboard' && (
          <Dashboard user={user} onSelectLevel={handleSelectLevel} />
        )}

        {currentView === 'game' && activeLevel !== null && (
          PHASER_LEVELS.includes(activeLevel) ? (
            <PhaserGameArena 
              user={user}
              levelId={activeLevel}
              onUpdateUser={handleUpdateUser} 
              onExit={handleExitLevel} 
            />
          ) : (
            <GameArena 
              user={user}
              levelId={activeLevel}
              onUpdateUser={handleUpdateUser} 
              onExit={handleExitLevel} 
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;