import React from 'react';
import { User } from '../types';
import { Button } from './Button';
import redPanda from '../assets/RedPanda.svg';

interface DashboardProps {
  user: User;
  onSelectLevel: (levelId: number) => void;
}

const LEVELS = [
  { id: 1, title: 'Saving Basics', description: 'Learn that coins have value and can be saved', color: 'bg-sprout-green' },
  { id: 2, title: 'Needs vs Wants', description: 'Understand trade-offs and cost comparison', color: 'bg-sprout-purple' },
  { id: 3, title: 'Earn & Spend', description: 'Plan your spending and savings', color: 'bg-yellow-400' },
  { id: 4, title: 'Future Goals', description: 'Set goals and save for the future', color: 'bg-blue-400' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectLevel }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 pb-32">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-60">
        
        {/* Left side - Red Panda mascot */}
        <div className="flex justify-center">
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-sprout-green/20 to-sprout-purple/20 rounded-full blur-3xl -z-10"></div>
            <img src={redPanda} alt="Red Panda mascot" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
        </div>

        {/* Right side - Levels path */}
        <div className="flex flex-col gap-6">
          {LEVELS.map((level, index) => {
            const isLocked = index > 0 && !user.completedLevels.includes(LEVELS[index - 1].id);
            const isCompleted = user.completedLevels.includes(level.id);

            return (
              <div key={level.id} className="flex flex-col gap-3">
                {/* Level header */}
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-gray-700">Level</h2>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${level.color}`}>
                    {level.id}
                  </span>
                </div>

                {/* Level card */}
                <button
                  onClick={() => !isLocked && onSelectLevel(level.id)}
                  disabled={isLocked}
                  className="flex items-center gap-4"
                >
                  {/* Checkmark / Lock icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isLocked 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-sprout-green text-white'
                  }`}>
                    {isLocked ? (
                      <span className="text-xl">🔒</span>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Card content */}
                  <div className={`flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-right transition-all ${
                    isLocked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-md hover:border-gray-200 cursor-pointer'
                  }`}>
                    <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                      {level.title}
                    </h3>
                    <p className={`text-sm ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                      {level.description}
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};