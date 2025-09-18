import { motion } from 'framer-motion';
import { telegram } from '../lib/telegram';

type Props = { value: string; onChange: (v: string) => void; onSubmit: () => void; allowDot?: boolean; };

const Key = ({ label, onPress }: { label: string; onPress: (s: string) => void }) => {
  const isSubmitButton = label === 'Добавить';
  const isDeleteButton = label === '⌫';
  
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }} 
      className={`h-14 rounded-2xl shadow-soft text-xl font-semibold flex items-center justify-center transition-all duration-200 ${
        isSubmitButton 
          ? 'bg-mint text-white col-span-1' 
          : isDeleteButton
          ? 'bg-card text-ink border-2 border-mint-soft'
          : 'bg-card text-ink hover:bg-mint-soft'
      }`}
      onClick={() => {
        telegram.hapticLight();
        onPress(label);
      }}
    >
      {label}
    </motion.button>
  );
};

export function Numpad({ value, onChange, onSubmit, allowDot = true }: Props) {
  const keys = [['1','2','3'],['4','5','6'],['7','8','9'],['⌫','0','Добавить']];
  function handlePress(s: string) {
    if (s === '⌫') { onChange(value.slice(0, -1)); return; }
    if (s === 'Добавить') { onSubmit(); return; }
    if (s === '.') {
      if (!allowDot) return;
      if (value.includes('.')) return;
    }
    onChange(value + s);
  }
  return (
    <div className="grid grid-cols-3 gap-3 p-4 w-full">
      {keys.flat().map(k => (
        <Key key={k} label={k} onPress={handlePress} />
      ))}
    </div>
  );
}


