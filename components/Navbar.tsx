import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onHome }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-gray-200 flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
        <div className="text-2xl">🌱</div>
        <h1 className="text-xl font-extrabold text-gray-700 tracking-tight hidden sm:block">
          Wealthsimple <span className="text-sprout-green">Sprout</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1">
          <span className="text-xl">🔥</span>
          <span className="font-bold text-gray-600">{user.streak}</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1">
          <span className="text-xl">🪙</span>
          <span className="font-bold text-sprout-purple">{user.coins}</span>
        </div>
        
      
        <button 
          onClick={onLogout}
          className="ml-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
};