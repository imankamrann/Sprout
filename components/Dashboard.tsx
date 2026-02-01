import React from 'react';
import { User } from '../types';
import { Button } from './Button';

interface DashboardProps {
  user: User;
  onSelectLevel: (levelId: number) => void;
}

const LEVELS = [
  { id: 1, title: 'Saving Basics', color: 'bg-sprout-green' },
  { id: 2, title: 'Needs vs Wants', color: 'bg-sprout-purple' },
  { id: 3, title: 'Earn & Spend', color: 'bg-yellow-400' },
  { id: 4, title: 'Future Goals', color: 'bg-blue-400' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectLevel }) => {
  return (
    <div className="max-w-md mx-auto py-10 px-4 flex flex-col items-center gap-8 pb-32">
        <div className="text-center mb-4">
            <h2 className="text-2xl font-black text-gray-700">Unit 1</h2>
            <p className="text-gray-500">Money Fundamentals</p>
        </div>

      {LEVELS.map((level, index) => {
        const isLocked = index > 0 && !user.completedLevels.includes(LEVELS[index - 1].id);
        const isCompleted = user.completedLevels.includes(level.id);
        
        // Stagger the layout for the "path" look
        const translateX = index % 2 === 0 ? '-translate-x-6' : 'translate-x-6';

        return (
          <div 
            key={level.id} 
            className={`relative ${translateX} transform transition-transform`}
          >
            <button
                onClick={() => !isLocked && onSelectLevel(level.id)}
                disabled={isLocked}
                className={`
                    w-20 h-20 rounded-full flex items-center justify-center text-3xl
                    border-b-8 transition-all active:border-b-0 active:translate-y-2
                    ${isLocked 
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' 
                        : `${level.color} border-black/20 text-white shadow-xl hover:brightness-110`
                    }
                `}
            >
                {isCompleted ? '⭐' : (isLocked ? '🔒' : '★')}
            </button>
            
            <div className="absolute top-full mt-2 w-32 left-1/2 transform -translate-x-1/2 text-center">
                <span className={`text-sm font-bold ${isLocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {level.title}
                </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};