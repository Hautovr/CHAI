import { useEffect, useState } from 'react';
import { useSettings } from '../store/settings.store';
import { useI18n } from '../lib/i18n';
import { ThemeToggle } from '../components/ThemeToggle';

export function Settings() {
  const { loaded, load, currency, rounding, quickAmounts, lang, showAvatar, dailyTarget, save } = useSettings();
  const { setLang } = useI18n();
  const [quick, setQuick] = useState('');

  useEffect(()=>{ load(); }, []);
  useEffect(()=>{ setQuick(quickAmounts.join(',')); }, [quickAmounts]);

  if (!loaded) return null;

  return (
    <div className="p-4 space-y-6">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Currency */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Валюта</label>
        <input 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink" 
          value={currency} 
          onChange={(e)=>save({ currency: e.target.value })} 
        />
      </div>
      
      {/* Rounding */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Округление</label>
        <select 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink" 
          value={rounding} 
          onChange={(e)=>save({ rounding: e.target.value as any })}
        >
          <option value="none">Нет</option>
          <option value="1">До 1</option>
          <option value="5">До 5</option>
        </select>
      </div>
      
      {/* Quick amounts */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Быстрые суммы</label>
        <input 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink" 
          placeholder="50,100,200,500"
          value={quick} 
          onChange={(e)=>setQuick(e.target.value)} 
          onBlur={()=>{
            const vals = quick.split(',').map(s=>parseInt(s.trim())).filter(n=>isFinite(n)&&n>0);
            save({ quickAmounts: vals });
          }} 
        />
      </div>
      
      {/* Daily target */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Цель на день (₽)</label>
        <input 
          type="number" 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink" 
          value={dailyTarget} 
          onChange={(e)=>save({ dailyTarget: parseInt(e.target.value)||0 })} 
        />
      </div>
      
      {/* Language */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">Язык</label>
        <select 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink" 
          value={lang} 
          onChange={(e)=>{ save({ lang: e.target.value as any }); setLang(e.target.value as any); }}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>
      
      {/* Show avatar */}
      <label className="flex items-center gap-3 p-4 bg-card rounded-2xl">
        <input 
          type="checkbox" 
          checked={showAvatar} 
          onChange={(e)=>save({ showAvatar: e.target.checked })}
          className="w-5 h-5 text-mint rounded focus:ring-mint"
        />
        <span className="text-ink font-medium">Показывать аватар Telegram</span>
      </label>
    </div>
  );
}


