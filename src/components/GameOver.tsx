import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRestart, onHome }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-4xl font-black mb-2">游戏结束</h2>
          <p className="text-slate-400">方块触顶了！</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-8">
          <span className="text-sm uppercase tracking-widest opacity-50 font-bold block mb-1">最终得分</span>
          <span className="text-5xl font-black text-white">{score}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onRestart}
            className="flex flex-col items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
            <span>重试</span>
          </button>
          <button 
            onClick={onHome}
            className="flex flex-col items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
          >
            <Home className="w-6 h-6" />
            <span>主菜单</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
