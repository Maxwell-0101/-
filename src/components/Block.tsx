import React from 'react';
import { motion } from 'motion/react';
import { BlockData } from '../types';

interface BlockProps {
  block: BlockData;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const COLORS = [
  'bg-block-1',
  'bg-block-2',
  'bg-block-3',
  'bg-block-4',
  'bg-block-5',
];

export const Block: React.FC<BlockProps> = ({ block, isSelected, onClick }) => {
  const colorClass = COLORS[block.value % COLORS.length];

  return (
    <motion.div
      layout
      initial={block.isNew ? { scale: 0, opacity: 0 } : false}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: 0 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(block.id)}
      className={`
        absolute w-[15%] h-[9%] flex items-center justify-center rounded-lg cursor-pointer
        font-bold text-2xl shadow-lg transition-all duration-200
        ${colorClass}
        ${isSelected ? 'ring-4 ring-white scale-110 z-10' : 'opacity-90'}
      `}
      style={{
        left: `${block.col * 16.66}%`,
        top: `${block.row * 10}%`,
      }}
    >
      <span className="drop-shadow-md">{block.value}</span>
    </motion.div>
  );
};
