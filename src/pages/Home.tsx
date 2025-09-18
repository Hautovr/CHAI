import { useEffect, useMemo } from 'react';
import { TipForm } from '../components/TipForm';
import { useTips } from '../store/tips.store';
import { rangeForToday, inRange } from '../utils/date';
import { useShifts } from '../store/shifts.store';
import { useSettings } from '../store/settings.store';
import AppHeader from '../components/AppHeader';
import { telegram } from '../lib/telegram';

export function Home({ onOpenShifts }: { onOpenShifts: () => void }) {
  const { tips, load } = useTips();
  const { currentShiftId, startShift, stopShift, load: loadShifts, ensureTodayShift } = useShifts();

  useEffect(() => { load(); loadShifts().then(()=>ensureTodayShift()); }, []);

  const today = useMemo(() => {
    const r = rangeForToday();
    return tips.filter(t => inRange(t.createdAt, r)).reduce((acc, t) => acc + t.amount, 0);
  }, [tips]);

  const user = telegram.getUser();
  const avatarUrl = user ? `https://t.me/i/userpic/320/${user.id}.jpg` : undefined;
  const { dailyTarget } = useSettings();
  const target = dailyTarget || 3000;
  const progress = Math.min(100, Math.round((today / target) * 100));
  return (
    <div>
      <div className="px-4 pt-4">
        <AppHeader name={user?.first_name} />
        <div className="rounded-3xl bg-card shadow-soft p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-semibold text-ink">Сегодня: {today} ₽</div>
            <button className="px-3 py-1 rounded-2xl bg-mint text-ink text-sm" onClick={()=>{
              const v = prompt('Новая цель на день (₽):', String(target));
              if (v) {
                const n = parseInt(v);
                if (isFinite(n) && n > 0) {
                  // lazy import to update settings safely
                  const st = require('../store/settings.store');
                  st.useSettings.getState().save({ dailyTarget: n });
                }
              }
            }}>Изменить цель</button>
          </div>
          <div className="h-3 rounded-full bg-mint-soft overflow-hidden">
            <div className="h-full bg-mint" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-muted mt-1">Цель: {target} ₽ · Прогресс: {progress}%</div>
        </div>
      </div>
      <TipForm />
    </div>
  );
}


