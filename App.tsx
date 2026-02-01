import React, { useState } from 'react';
import { User } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GameArena } from './components/GameArena';
import { AuthScreen } from './components/AuthScreen';

const MOCK_USER: User = {
  username: 'Guest',
  email: '',
  xp: 120,
  coins: 50,
  streak: 3,
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

  const handleUpdateUser = (xpEarned: number, coinsEarned: number) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      // If we finished a level (mock logic: simply by earning XP in the game view)
      // In a real app, this would check specific win conditions.
      const newCompletedLevels = activeLevel && !prev.completedLevels.includes(activeLevel) 
        ? [...prev.completedLevels, activeLevel] 
        : prev.completedLevels;

      return {
        ...prev,
        xp: prev.xp + xpEarned,
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

        {currentView === 'game' && (
          <GameArena 
            onUpdateUser={handleUpdateUser} 
            onExit={handleExitLevel} 
          />
        )}
      </main>
    </div>
  );
};

export default App;