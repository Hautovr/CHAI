import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function FriendlyButton({ children, onClick, className = '' }: { children: ReactNode; onClick?: () => void; className?: string; }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} className={`w-full rounded-2xl px-4 py-3 bg-primary text-primaryText shadow-soft ${className}`} onClick={onClick}>
      {children}
    </motion.button>
  );
}


