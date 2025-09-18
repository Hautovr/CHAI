import { useEffect, useMemo, useState } from 'react';
import { useTips } from '../store/tips.store';
import { Range, rangeForToday, rangeForWeek, rangeForMonth, inRange } from '../utils/date';
import { StatCard } from '../components/StatCard';
import { motion } from 'framer-motion';
import { telegram } from '../lib/telegram';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

type Mode = 'day'|'week'|'month'|'custom';
const MODE_LABEL_RU: Record<Mode, string> = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  custom: 'Диапазон',
};

export function Stats() {
  const { tips, load } = useTips();
  const [mode, setMode] = useState<Mode>('day');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
  useEffect(()=>{ load(); }, []);

  // Calculate range based on mode
  const range = useMemo((): Range => {
    switch (mode) {
      case 'day': return rangeForToday();
      case 'week': return rangeForWeek();
      case 'month': return rangeForMonth();
      case 'custom':
        if (customFrom && customTo) {
          return {
            from: new Date(customFrom),
            to: new Date(customTo + 'T23:59:59')
          };
        }
        return rangeForToday();
      default: return rangeForToday();
    }
  }, [mode, customFrom, customTo]);

  const filtered = useMemo(() => tips.filter(t => inRange(t.createdAt, range)), [tips, range]);
  const total = filtered.reduce((a, t)=>a+t.amount, 0);
  const count = filtered.length;
  const avg = count ? total / count : 0;

  const handleModeChange = (newMode: Mode) => {
    telegram.hapticLight();
    setMode(newMode);
  };

  // Get period description
  const periodDescription = useMemo(() => {
    switch (mode) {
      case 'day': return format(range.from, 'd MMMM yyyy', { locale: ru });
      case 'week': return `${format(range.from, 'd MMM', { locale: ru })} - ${format(range.to, 'd MMM yyyy', { locale: ru })}`;
      case 'month': return format(range.from, 'LLLL yyyy', { locale: ru });
      case 'custom': return customFrom && customTo ? `${format(new Date(customFrom), 'd MMM', { locale: ru })} - ${format(new Date(customTo), 'd MMM yyyy', { locale: ru })}` : 'Выберите диапазон';
      default: return '';
    }
  }, [mode, range, customFrom, customTo]);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Period Selector */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto">
          {(['day','week','month','custom'] as Mode[]).map(m => (
            <motion.button 
              key={m} 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                m === mode 
                  ? 'bg-mint text-white shadow-soft' 
                  : 'bg-card text-ink hover:bg-mint-soft'
              }`}
            >
              {MODE_LABEL_RU[m]}
            </motion.button>
          ))}
        </div>
        
        {/* Period Description */}
        <div className="text-center text-sm text-muted font-medium">
          {periodDescription}
        </div>
        
        {/* Custom Date Range */}
        {mode === 'custom' && (
          <div className="flex gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink text-sm"
              placeholder="От"
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink text-sm"
              placeholder="До"
            />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Сумма" value={`${total.toLocaleString()} ₽`} />
        <StatCard label="Записей" value={String(count)} />
        <StatCard label="Среднее" value={`${avg.toFixed(0)} ₽`} />
      </div>

      {/* Tips List for Current Period */}
      {filtered.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Записи за период:</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filtered.slice(0, 10).map((tip) => (
              <div key={tip.id} className="bg-card rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-ink">{tip.amount.toLocaleString()} ₽</div>
                  <div className="text-xs text-muted">
                    {format(tip.createdAt, 'd MMM, HH:mm', { locale: ru })}
                  </div>
                </div>
                {tip.note && (
                  <div className="text-xs text-muted max-w-[120px] truncate">
                    {tip.note}
                  </div>
                )}
              </div>
            ))}
            {filtered.length > 10 && (
              <div className="text-center text-sm text-muted py-2">
                и еще {filtered.length - 10} записей...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-ink font-medium">Нет записей за этот период</div>
          <div className="text-sm text-muted">Добавьте чаевые на главной странице</div>
        </div>
      )}
    </div>
  );
}


