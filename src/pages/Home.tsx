import { useEffect, useMemo, useState } from 'react';
import { TipForm } from '../components/TipForm';
import { useTips } from '../store/tips.store';
import { rangeForToday, inRange } from '../utils/date';
import { useShifts } from '../store/shifts.store';
import { useSettings } from '../store/settings.store';
import { useAchievements } from '../store/achievements.store';
import AppHeader from '../components/AppHeader';
import { telegram } from '../lib/telegram';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { PremiumFeatures } from '../components/PremiumFeatures';
import { AdvancedAnalytics } from '../components/AdvancedAnalytics';
import { DataExport } from '../components/DataExport';
import { SmartNotifications } from '../components/SmartNotifications';
import { CustomThemes } from '../components/CustomThemes';
import { CloudSync } from '../components/CloudSync';
import { PrioritySupport } from '../components/PrioritySupport';
import { StarsPayment } from '../components/StarsPayment';
import { AdminPanel } from '../components/AdminPanel';

export function Home({ onOpenShifts }: { onOpenShifts: () => void }) {
  const { tips, load } = useTips();
  const { currentShiftId, startShift, stopShift, load: loadShifts, ensureTodayShift } = useShifts();
  const { dailyTarget, save } = useSettings();
  const { load: loadAchievements, checkAchievements } = useAchievements();
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('');

  useEffect(() => { 
    load(); 
    loadShifts().then(()=>ensureTodayShift());
    loadAchievements();
  }, []);

  // Проверяем достижения при изменении чаевых
  useEffect(() => {
    if (tips.length > 0 && dailyTarget) {
      checkAchievements(tips, dailyTarget);
    }
  }, [tips, dailyTarget]);

  const today = useMemo(() => {
    const r = rangeForToday();
    return tips.filter(t => inRange(t.createdAt, r)).reduce((acc, t) => acc + t.amount, 0);
  }, [tips]);

  const user = telegram.getUser();
  const target = dailyTarget || 3000;
  const progress = Math.min(100, Math.round((today / target) * 100));

  const handleEditTarget = () => {
    setTargetInput(target.toString());
    setIsEditingTarget(true);
    telegram.hapticLight();
  };

  const handleSaveTarget = async () => {
    const newTarget = parseInt(targetInput);
    if (!isNaN(newTarget) && newTarget > 0) {
      await save({ dailyTarget: newTarget });
      setIsEditingTarget(false);
      telegram.hapticLight();
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTarget(false);
    telegram.hapticLight();
  };
  return (
    <div>
      <div className="px-4 pt-4">
        <AppHeader name={user?.first_name} />
        <SubscriptionStatus />
        <div className="rounded-3xl bg-card shadow-soft p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xl font-semibold text-ink">Сегодня: {today.toLocaleString()} ₽</div>
            {!isEditingTarget ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleEditTarget}
                className="px-3 py-1 rounded-full bg-mint text-white text-xs font-medium shadow-sm hover:opacity-90 transition-all duration-200"
              >
                Изменить цель
              </motion.button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg bg-card border-2 border-mint text-ink text-sm text-center outline-none"
                  placeholder="3000"
                  autoFocus
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveTarget}
                  className="p-1 rounded-full bg-mint text-white shadow-sm hover:opacity-90"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="p-1 rounded-full bg-gray-400 text-white shadow-sm hover:opacity-90"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
          <div className="h-3 rounded-full bg-mint-soft overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-mint to-emerald-400 transition-all duration-500 ease-out" 
            />
          </div>
          <div className="text-xs text-muted mt-1 text-center">
            Цель: {target.toLocaleString()} ₽ · Прогресс: {progress}%
          </div>
        </div>
      </div>
      <TipForm />
      <div className="px-4 pb-4">
        {/* Временно отключено
        <StarsPayment />
        <PremiumFeatures />
        <AdvancedAnalytics />
        <DataExport />
        <SmartNotifications />
        <CustomThemes />
        <CloudSync />
        <PrioritySupport />
        */}
      </div>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
}


