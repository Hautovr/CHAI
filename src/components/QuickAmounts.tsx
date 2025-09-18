import { useSettings } from '../store/settings.store';
import { motion } from 'framer-motion';
import { telegram } from '../lib/telegram';

export function QuickAmounts({ onAdd }: { onAdd: (v: number) => void }) {
  const { quickAmounts } = useSettings();
  
  const handleAdd = (value: number) => {
    telegram.hapticLight();
    onAdd(value);
  };
  
  return (
    <div className="px-4 py-2">
      <div className="text-sm font-medium text-ink mb-2 text-center">Быстрые суммы</div>
      <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
        {quickAmounts.map((value, index) => (
          <motion.button
            key={value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAdd(value)}
            className="px-4 py-2 rounded-full bg-mint text-white font-semibold shadow-soft hover:opacity-90 transition-all duration-200 min-w-[60px]"
          >
            +{value}
          </motion.button>
        ))}
      </div>
    </div>
  );
}


