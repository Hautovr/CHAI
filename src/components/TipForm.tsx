import { useState } from 'react';
import { motion } from 'framer-motion';
import { Numpad } from './Numpad';
import { QuickAmounts } from './QuickAmounts';
import { TablesStats } from './TablesStats';
import { AchievementsCompact } from './AchievementsCompact';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';
import { useAchievements } from '../store/achievements.store';
import { telegram } from '../lib/telegram';


export function TipForm() {
  const { add, lastMethod, tips } = useTips();
  const { currency, dailyTarget } = useSettings();
  const { checkAchievements } = useAchievements();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  async function submit() {
    const val = parseFloat(amount.replace(',', '.'));
    if (!isFinite(val) || val <= 0) return;
    await add(val, lastMethod, note || undefined);
    setAmount('');
    telegram.hapticLight();
    
    // Проверяем достижения после добавления чаевых
    setTimeout(() => {
      checkAchievements(tips, dailyTarget);
    }, 100);
  }

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Amount Display */}
      <div className="text-center py-4 px-4 bg-gradient-to-b from-card to-transparent flex-shrink-0">
        <div className="text-sm text-muted mb-2">Введите сумму чаевых</div>
        <motion.div 
          className="text-4xl font-bold text-ink tracking-tight mb-1"
          key={amount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {(amount || '0')}
        </motion.div>
        <div className="text-lg text-muted font-medium">
          {currency}
        </div>
      </div>
      
      {/* Quick Amounts */}
      <div className="flex-shrink-0">
        <QuickAmounts onAdd={(v)=> setAmount(a => (parseFloat(a||'0') + v).toString())} />
      </div>
      
      {/* Note Input */}
      <div className="px-4 pb-2 flex-shrink-0">
        <input 
          value={note} 
          onChange={(e)=>setNote(e.target.value)} 
          placeholder="Заметка (необязательно)" 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink placeholder:text-muted"
        />
      </div>
      
      {/* Numpad */}
      <div className="flex-1 flex items-end">
        <Numpad value={amount} onChange={setAmount} onSubmit={submit} />
      </div>
      
      {/* Tables Stats */}
      <div className="px-4 pb-2 flex-shrink-0">
        <TablesStats onAddTable={() => {}} />
      </div>
      
      {/* Achievements */}
      <div className="px-4 pb-2 flex-shrink-0">
        <AchievementsCompact />
      </div>
    </div>
  );
}


