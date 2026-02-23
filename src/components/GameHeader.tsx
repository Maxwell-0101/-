import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Timer, Target, ArrowLeft } from 'lucide-react';
import { GameMode } from '../types';

interface GameHeaderProps {
  score: number;
  targetSum: number;
  currentSum: number;
  timeLeft: number;
  mode: GameMode;
  onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  targetSum, 
  currentSum, 
  timeLeft, 
  mode,
  onBack
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-xl">{score}</span>
          </div>
          
          {mode === 'time' && (
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Timer className={`w-5 h-5 ${timeLeft < 3 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
              <span className={`font-mono font-bold text-xl ${timeLeft < 3 ? 'text-red-500' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
          <motion.div 
            className="h-full bg-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${(currentSum / targetSum) * 100}%` }}
          />
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-6 h-6 text-emerald-400" />
          <span className="text-sm uppercase tracking-widest opacity-60 font-semibold">目标数字</span>
        </div>
        
        <div className="flex items-baseline gap-4">
          <span className="text-6xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            {targetSum}
          </span>
          <div className="flex flex-col">
            <span className="text-xs opacity-40 uppercase font-bold">当前和</span>
            <span className={`text-2xl font-bold ${currentSum > targetSum ? 'text-red-400' : 'text-white'}`}>
              {currentSum}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
