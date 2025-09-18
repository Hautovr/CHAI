import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { telegram } from '../lib/telegram';

interface TableCounterProps {
  value: number;
  onChange: (value: number) => void;
}

export function TableCounter({ value, onChange }: TableCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const increment = () => {
    onChange(value + 1);
    setIsAnimating(true);
    telegram.hapticLight();
    setTimeout(() => setIsAnimating(false), 200);
  };

  const decrement = () => {
    if (value > 0) {
      onChange(value - 1);
      setIsAnimating(true);
      telegram.hapticLight();
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={decrement}
        disabled={value === 0}
        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg border-2 ${
          value === 0 
            ? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed border-gray-400' 
            : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 active:from-red-700 active:to-red-800 border-red-700 shadow-red-300'
        }`}
        whileHover={{ 
          scale: value > 0 ? 1.08 : 1,
          boxShadow: value > 0 ? "0 8px 16px rgba(239, 68, 68, 0.3)" : "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
        whileTap={{ 
          scale: value > 0 ? 0.92 : 1
        }}
      >
        <span className="text-xl font-bold">-</span>
      </motion.button>

      <motion.div
        className="min-w-[75px] text-center bg-gradient-to-br from-ink to-gray-800 rounded-2xl py-3 px-4 shadow-lg border-2 border-mint"
        animate={isAnimating ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        <div className="text-2xl font-black text-mint drop-shadow-md">
          {value}
        </div>
        <div className="text-xs text-mint-soft font-semibold">
          {value === 1 ? 'стол' : value < 5 ? 'стола' : 'столов'}
        </div>
      </motion.div>

      <motion.button
        onClick={increment}
        className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:from-green-700 active:to-green-800 flex items-center justify-center transition-all duration-200 shadow-lg border-2 border-green-700 shadow-green-300"
        whileHover={{ 
          scale: 1.08,
          boxShadow: "0 8px 16px rgba(34, 197, 94, 0.3)"
        }}
        whileTap={{ 
          scale: 0.92
        }}
      >
        <span className="text-xl font-bold">+</span>
      </motion.button>
    </div>
  );
}
