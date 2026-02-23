import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Timer, Sparkles, ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { Block } from './components/Block';
import { GameHeader } from './components/GameHeader';
import { GameOver } from './components/GameOver';
import { ConfirmationModal } from './components/ConfirmationModal';
import { GameMode } from './types';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const {
    grid,
    score,
    targetSum,
    selectedIds,
    isGameOver,
    timeLeft,
    selectBlock,
    initGame,
  } = useGameLogic(gameMode || 'classic', showExitConfirm);

  const currentSum = grid
    .filter(b => selectedIds.includes(b.id))
    .reduce((sum, b) => sum + b.value, 0);

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    initGame();
  };

  const handleHome = () => {
    setGameMode(null);
    setShowExitConfirm(false);
  };

  const handleBackClick = () => {
    setShowExitConfirm(true);
  };

  if (showRules) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-game-bg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-emerald-400 w-8 h-8" />
            <h2 className="text-3xl font-black">游戏规则</h2>
          </div>

          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <section>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                核心玩法
              </h4>
              <p>点击网格中的数字方块，使选中方块的数值之和等于屏幕上方显示的“目标数字”。数字不需要相邻，可以跨行跨列选择。</p>
            </section>

            <section>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                得分方法
              </h4>
              <p>成功凑齐目标数字后，选中的方块会被消除。得分计算公式为：<span className="text-emerald-400 font-mono">目标数字 × 消除方块数量</span>。一次性消除的方块越多，得分越高！</p>
            </section>

            <section>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                失败条件
              </h4>
              <p>如果方块堆积到屏幕顶部的红线以上，游戏即告结束。请务必在方块触顶前完成消除。</p>
            </section>

            <section>
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                模式区别
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li><span className="text-blue-400 font-bold">经典模式</span>：每次成功消除后，底部会新增一行方块。</li>
                <li><span className="text-purple-400 font-bold">计时模式</span>：必须在倒计时结束前完成消除，否则强制新增一行。</li>
              </ul>
            </section>
          </div>

          <button 
            onClick={() => setShowRules(false)}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回菜单</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (!gameMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-game-bg">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl rotate-12 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter">数块求和消除</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-xs mx-auto">
            掌握数学，消除方块，挑战极限。
          </p>
        </motion.div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <button 
            onClick={() => handleStart('classic')}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex items-center justify-between transition-all active:scale-95 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Play className="text-blue-400 w-6 h-6 fill-current" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">经典模式</h3>
                <p className="text-sm text-slate-500">每次成功消除后新增一行</p>
              </div>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={() => handleStart('time')}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex items-center justify-between transition-all active:scale-95 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Timer className="text-purple-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">计时模式</h3>
                <p className="text-sm text-slate-500">与时间赛跑，争分夺秒</p>
              </div>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
          </button>

          <button 
            onClick={() => setShowRules(true)}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-3xl flex items-center justify-between transition-all active:scale-95 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <BookOpen className="text-emerald-400 w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">游戏规则</h3>
                <p className="text-sm text-slate-500">了解玩法与得分机制</p>
              </div>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="mt-12 text-xs text-slate-600 uppercase tracking-widest font-bold">
          由 React & Tailwind 驱动
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-game-bg select-none touch-none">
      <GameHeader 
        score={score}
        targetSum={targetSum}
        currentSum={currentSum}
        timeLeft={timeLeft}
        mode={gameMode}
        onBack={handleBackClick}
      />

      <main className="flex-1 relative w-full max-w-md mx-auto px-4 pb-8">
        <div className="relative w-full h-full bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-inner">
          {/* Grid Background Lines */}
          <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-r border-white/20 h-full" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-10 pointer-events-none opacity-20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border-b border-white/20 w-full" />
            ))}
          </div>

          {/* Blocks */}
          <AnimatePresence>
            {grid.map(block => (
              <Block 
                key={block.id}
                block={block}
                isSelected={selectedIds.includes(block.id)}
                onClick={selectBlock}
              />
            ))}
          </AnimatePresence>
          
          {/* Warning Line */}
          <div className="absolute top-[10%] left-0 w-full h-0.5 bg-red-500/30 border-b border-dashed border-red-500/50" />
        </div>
      </main>

      {isGameOver && (
        <GameOver 
          score={score} 
          onRestart={() => initGame()} 
          onHome={handleHome} 
        />
      )}

      <ConfirmationModal 
        isOpen={showExitConfirm}
        title="退出游戏？"
        message="当前进度将不会被保存，确定要退出并返回主菜单吗？"
        onConfirm={handleHome}
        onCancel={() => setShowExitConfirm(false)}
        confirmText="退出"
        cancelText="继续游戏"
      />
    </div>
  );
}
