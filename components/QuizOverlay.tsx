import React, { useState } from 'react';
import { Scenario } from '../types';
import { Button } from './Button';

interface QuizOverlayProps {
  scenario: Scenario;
  onComplete: (success: boolean, reward: { xp: number, coins: number }) => void;
  onClose: () => void;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({ scenario, onComplete, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setHasSubmitted(true);
  };

  const handleContinue = () => {
    const isCorrect = selectedIdx === scenario.correctAnswerIndex;
    onComplete(isCorrect, scenario.reward);
  };

  const isCorrect = selectedIdx === scenario.correctAnswerIndex;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header / NPC Dialogue */}
        <div className="p-6 bg-sprout-purple/10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border-2 border-sprout-purple">
            🧙‍♂️
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sprout-purple uppercase text-sm mb-1">Shopkeeper</h3>
            <p className="text-gray-700 font-medium leading-tight">{scenario.question}</p>
          </div>
        </div>

        {/* Options */}
        <div className="p-6 flex flex-col gap-3 overflow-y-auto">
          {scenario.options.map((option, idx) => {
            let stateClass = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
            
            if (hasSubmitted) {
              if (idx === scenario.correctAnswerIndex) {
                stateClass = "border-sprout-green bg-green-100 text-green-800";
              } else if (idx === selectedIdx && idx !== scenario.correctAnswerIndex) {
                stateClass = "border-red-500 bg-red-100 text-red-800";
              } else {
                stateClass = "border-gray-100 text-gray-400 opacity-50";
              }
            } else if (selectedIdx === idx) {
              stateClass = "border-sprout-purple bg-purple-50 text-sprout-purple";
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all ${stateClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t-2 ${hasSubmitted ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') : 'bg-white border-gray-100'}`}>
          {!hasSubmitted ? (
            <Button 
              fullWidth 
              onClick={handleSubmit} 
              disabled={selectedIdx === null}
              variant={selectedIdx === null ? 'outline' : 'primary'}
            >
              CHECK ANSWER
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold">
                 <span className={`text-xl ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                 </span>
              </div>
              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {scenario.explanation}
              </p>
              <Button 
                fullWidth 
                variant={isCorrect ? 'primary' : 'danger'}
                onClick={handleContinue}
              >
                CONTINUE
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};