import { motion } from 'framer-motion';

type Props = { value: string; onChange: (v: string) => void; onSubmit: () => void; allowDot?: boolean; };

const Key = ({ label, onPress }: { label: string; onPress: (s: string) => void }) => (
  <motion.button whileTap={{ scale: 0.95 }} className="h-14 rounded-2xl bg-card shadow-soft text-2xl text-ink flex items-center justify-center" onClick={() => onPress(label)}>
    {label}
  </motion.button>
);

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
    <div className="grid grid-cols-3 gap-3">
      {keys.flat().map(k => (
        <Key key={k} label={k} onPress={handlePress} />
      ))}
    </div>
  );
}


