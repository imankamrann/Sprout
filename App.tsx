import React, { useState } from 'react';
import { User } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { GameArena } from './components/GameArena';
import { PhaserGameArena } from './components/game/PhaserGameArena';
import { AuthScreen } from './components/AuthScreen';
import { authService } from './services/authService';

// Levels that use the Phaser-based game arena (store/shopping quests)
const PHASER_LEVELS = [1, 2, 3, 4];

const MOCK_USER: User = {
  username: 'Guest',
  email: '',
  coins: 0,
  completedLevels: []
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'game'>('dashboard');
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const handleLogin = (username: string) => {
    // Get user data from authService (stored after login/signup)
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser({
        username: storedUser.username,
        email: storedUser.email,
        coins: storedUser.coins,
        completedLevels: storedUser.completedLevels
      });
    } else {
      setUser({ ...MOCK_USER, username });
    }
  };

  const handleLogout = () => {
    authService.logout();
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

  const handleNextLevel = () => {
    if (activeLevel && activeLevel < 4) {
      setActiveLevel(activeLevel + 1);
    } else {
      // Last level completed, go to dashboard
      setActiveLevel(null);
      setCurrentView('dashboard');
    }
  };

  const handleUpdateUser = async (coinsEarned: number) => {
    if (!user) return;
    
    // Calculate new values
    const newCoins = user.coins + coinsEarned;
    const newCompletedLevels = activeLevel && !user.completedLevels.includes(activeLevel) 
      ? [...user.completedLevels, activeLevel] 
      : user.completedLevels;

    // Update local state
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        coins: newCoins,
        completedLevels: newCompletedLevels
      };
    });

    // Sync to database
    try {
      await authService.updateUser(newCoins, newCompletedLevels);
      console.log('✅ Synced to database: coins=' + newCoins + ', levels=' + newCompletedLevels);
    } catch (error) {
      console.error('Failed to sync to database:', error);
    }
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
              onNextLevel={handleNextLevel}
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