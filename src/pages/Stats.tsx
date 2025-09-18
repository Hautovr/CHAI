import { useEffect, useMemo, useState } from 'react';
import { useTips } from '../store/tips.store';
import { Range, rangeForToday, inRange } from '../utils/date';
import { StatCard } from '../components/StatCard';

type Mode = 'day'|'week'|'month'|'custom';
const MODE_LABEL_RU: Record<Mode, string> = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  custom: 'Диапазон',
};

export function Stats() {
  const { tips, load } = useTips();
  const [mode] = useState<Mode>('day');
  const [range] = useState<Range>(rangeForToday());
  useEffect(()=>{ load(); }, []);

  const filtered = useMemo(() => tips.filter(t => inRange(t.createdAt, range)), [tips, range]);
  const total = filtered.reduce((a, t)=>a+t.amount, 0);
  const count = filtered.length;
  const avg = count ? total / count : 0;

  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex gap-2">
        {(['day','week','month','custom'] as Mode[]).map(m => (
          <button key={m} className={`px-3 py-2 rounded-2xl text-sm ${m===mode?'bg-tg_button text-tg_button_text':'bg-card shadow-soft'}`}>{MODE_LABEL_RU[m]}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Сумма" value={total.toFixed(0)} />
        <StatCard label="Кол-во" value={String(count)} />
        <StatCard label="Средний" value={avg.toFixed(0)} />
      </div>
      {/* CSV export removed by request */}
    </div>
  );
}


