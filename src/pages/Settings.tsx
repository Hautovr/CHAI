import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../store/settings.store';
import { useAchievements } from '../store/achievements.store';
import { useI18n } from '../lib/i18n';
import { ThemeToggle } from '../components/ThemeToggle';
import { telegram } from '../lib/telegram';

export function Settings() {
  const { loaded, load, currency, rounding, quickAmounts, lang, showAvatar, dailyTarget, notificationsEnabled, save } = useSettings();
  const { resetAchievements } = useAchievements();
  const { setLang } = useI18n();
  const [quick, setQuick] = useState('');

  useEffect(()=>{ load(); }, []);
  useEffect(()=>{ setQuick(quickAmounts.join(',')); }, [quickAmounts]);

  const handleResetAchievements = () => {
    resetAchievements();
    telegram.hapticLight();
  };

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
      
      {/* Notifications */}
      <label className="flex items-center gap-3 p-4 bg-card rounded-2xl">
        <input 
          type="checkbox" 
          checked={notificationsEnabled} 
          onChange={(e)=>save({ notificationsEnabled: e.target.checked })}
          className="w-5 h-5 text-mint rounded focus:ring-mint"
        />
        <span className="text-ink font-medium">Напоминания о чаевых 24/7 каждые полчаса</span>
      </label>

      {/* Reset achievements */}
      <motion.button
        onClick={handleResetAchievements}
        className="w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 hover:text-red-700 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="text-lg">🗑️</div>
          <div>Сбросить все достижения</div>
        </div>
      </motion.button>

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


