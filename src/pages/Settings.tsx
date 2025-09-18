import { useEffect, useState } from 'react';
import { useSettings } from '../store/settings.store';
import { useI18n } from '../lib/i18n';

export function Settings() {
  const { loaded, load, currency, rounding, quickAmounts, lang, showAvatar, dailyTarget, save } = useSettings();
  const { setLang } = useI18n();
  const [quick, setQuick] = useState('');

  useEffect(()=>{ load(); }, []);
  useEffect(()=>{ setQuick(quickAmounts.join(',')); }, [quickAmounts]);

  if (!loaded) return null;

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <div className="text-sm text-gray-500">Валюта</div>
        <input className="mt-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" value={currency} onChange={(e)=>save({ currency: e.target.value })} />
      </div>
      <div>
        <div className="text-sm text-gray-500">Округление</div>
        <select className="mt-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" value={rounding} onChange={(e)=>save({ rounding: e.target.value as any })}>
          <option value="none">нет</option>
          <option value="1">до 1</option>
          <option value="5">до 5</option>
        </select>
      </div>
      <div>
        <div className="text-sm text-gray-500">Быстрые суммы</div>
        <input className="mt-1 w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" value={quick} onChange={(e)=>setQuick(e.target.value)} onBlur={()=>{
          const vals = quick.split(',').map(s=>parseInt(s.trim())).filter(n=>isFinite(n)&&n>0);
          save({ quickAmounts: vals });
        }} />
      </div>
      <div>
        <div className="text-sm text-gray-500">Цель на день (₽)</div>
        <input type="number" className="mt-1 w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" value={dailyTarget} onChange={(e)=>save({ dailyTarget: parseInt(e.target.value)||0 })} />
      </div>
      <div>
        <div className="text-sm text-gray-500">Язык</div>
        <select className="mt-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" value={lang} onChange={(e)=>{ save({ lang: e.target.value as any }); setLang(e.target.value as any); }}>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={showAvatar} onChange={(e)=>save({ showAvatar: e.target.checked })} />
        Показывать аватар Telegram
      </label>
    </div>
  );
}


