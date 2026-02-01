import React, { useState } from 'react';
import { NPC } from '../types';
import { Button } from './Button';

interface StoryOverlayProps {
  npc: NPC;
  onComplete: (success: boolean, reward: { xp: number, coins: number }) => void;
  onClose: () => void;
}

export const StoryOverlay: React.FC<StoryOverlayProps> = ({ npc, onComplete, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handlePlaySound = () => {
    if ('speechSynthesis' in window && npc.story.prompt) {
      const utterance = new SpeechSynthesisUtterance(npc.story.prompt);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setHasSubmitted(true);
  };

  const handleContinue = () => {
    const isCorrect = selectedIdx === npc.story.correctAnswerIndex;
    onComplete(isCorrect, npc.story.reward);
  };

  const isCorrect = selectedIdx === npc.story.correctAnswerIndex;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header / NPC Dialogue */}
        <div className="p-6 bg-sprout-purple/10 flex items-start gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm border-2 border-sprout-purple flex-shrink-0">
            {npc.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sprout-purple uppercase text-sm mb-1">{npc.name}</h3>
            <p className="text-gray-700 font-medium leading-tight">{npc.story.prompt}</p>
          </div>
          <button onClick={handlePlaySound} className="text-2xl hover:text-sprout-purple transition-colors">
            🔊
          </button>
        </div>

        {/* Options */}
        <div className="p-6 flex flex-col gap-3 overflow-y-auto">
          {npc.story.options.map((option, idx) => {
            let stateClass = "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
            
            if (hasSubmitted) {
              if (idx === npc.story.correctAnswerIndex) {
                stateClass = "border-sprout-green bg-green-100 text-green-800";
              } else if (idx === selectedIdx && idx !== npc.story.correctAnswerIndex) {
                stateClass = "border-red-500 bg-red-100 text-red-800";
              } else {
                stateClass = "border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
              }
            } else if (selectedIdx === idx) {
              stateClass = "border-sprout-purple bg-purple-50 text-sprout-purple";
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-4 rounded-xl border-b-4 text-left transition-all flex justify-between items-center ${stateClass}`}
              >
                <span className="font-bold">{option.text}</span>
                {option.coins && (
                    <span className="flex items-center gap-1 font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-lg">
                        {option.coins} 🪙
                    </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t-2 transition-colors ${hasSubmitted ? (isCorrect ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200') : 'bg-white border-gray-100'}`}>
          {!hasSubmitted ? (
            <Button 
              fullWidth 
              onClick={handleSubmit} 
              disabled={selectedIdx === null}
              variant={selectedIdx === null ? 'outline' : 'primary'}
              className="py-4 text-lg"
            >
              Check
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                 <h4 className={`text-2xl font-black ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite!'}
                 </h4>
                 <p className={`font-bold mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {npc.story.explanation}
                 </p>
              </div>
              <Button 
                fullWidth 
                variant={isCorrect ? 'primary' : 'danger'}
                onClick={handleContinue}
                className="py-4 text-lg"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
