import { useState, useEffect, useCallback, useRef } from 'react';
import { BlockData, GameMode, GRID_COLS, GRID_ROWS, INITIAL_ROWS, TIME_LIMIT } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createRow = (rowIdx: number): BlockData[] => {
  return Array.from({ length: GRID_COLS }, (_, colIdx) => ({
    id: generateId(),
    value: Math.floor(Math.random() * 9) + 1,
    row: rowIdx,
    col: colIdx,
    isNew: true,
  }));
};

export const useGameLogic = (mode: GameMode, isPaused: boolean = false) => {
  const [grid, setGrid] = useState<BlockData[]>([]);
  const [score, setScore] = useState(0);
  const [targetSum, setTargetSum] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [level, setLevel] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateTarget = useCallback(() => {
    const newTarget = Math.floor(Math.random() * 15) + 10; // 10 to 25
    setTargetSum(newTarget);
  }, []);

  const initGame = useCallback(() => {
    let initialGrid: BlockData[] = [];
    for (let r = 0; r < INITIAL_ROWS; r++) {
      initialGrid = [...initialGrid, ...createRow(GRID_ROWS - 1 - r)];
    }
    setGrid(initialGrid);
    setScore(0);
    setIsGameOver(false);
    setSelectedIds([]);
    setTimeLeft(TIME_LIMIT);
    setLevel(1);
    generateTarget();
  }, [generateTarget]);

  const addRow = useCallback(() => {
    setGrid(prev => {
      // Check if any block is at row 0
      const willHitTop = prev.some(b => b.row === 0);
      if (willHitTop) {
        setIsGameOver(true);
        return prev;
      }

      // Shift existing blocks up
      const shiftedGrid = prev.map(b => ({ ...b, row: b.row - 1, isNew: false }));
      // Add new row at the bottom
      const newRow = createRow(GRID_ROWS - 1);
      return [...shiftedGrid, ...newRow];
    });
    
    if (mode === 'time') {
      setTimeLeft(TIME_LIMIT);
    }
  }, [mode]);

  const selectBlock = (id: string) => {
    if (isGameOver || isPaused) return;

    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  };

  // Check sum
  useEffect(() => {
    if (isPaused) return;

    const currentSum = grid
      .filter(b => selectedIds.includes(b.id))
      .reduce((sum, b) => sum + b.value, 0);

    if (currentSum === targetSum) {
      // Success!
      const clearedCount = selectedIds.length;
      setScore(s => s + targetSum * clearedCount);
      setGrid(prev => prev.filter(b => !selectedIds.includes(b.id)));
      setSelectedIds([]);
      generateTarget();
      
      if (mode === 'classic') {
        addRow();
      }
    } else if (currentSum > targetSum) {
      // Over sum - clear selection with a penalty or just clear?
      // Let's just clear selection for now
      setSelectedIds([]);
    }
  }, [selectedIds, targetSum, grid, generateTarget, addRow, mode, isPaused]);

  // Timer for Time Mode
  useEffect(() => {
    if (mode === 'time' && !isGameOver && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            addRow();
            return TIME_LIMIT;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, isGameOver, addRow, isPaused]);

  return {
    grid,
    score,
    targetSum,
    selectedIds,
    isGameOver,
    timeLeft,
    level,
    selectBlock,
    initGame,
  };
};
