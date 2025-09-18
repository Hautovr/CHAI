import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAchievements } from '../store/achievements.store';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';
import { Flame, Calendar, Target } from 'lucide-react';

export function Streaks() {
  const { streaks, load, getStreak, updateStreak } = useAchievements();
  const { tips, load: loadTips } = useTips();
  const { dailyTarget } = useSettings();

  useEffect(() => {
    load();
    loadTips();
  }, []);

  useEffect(() => {
    if (tips.length > 0 && dailyTarget) {
      // Проверяем, достигли ли цели сегодня
      const today = new Date();
      const todayTips = tips.filter(tip => {
        const tipDate = new Date(tip.createdAt);
        return tipDate.toDateString() === today.toDateString();
      });
      const todayTotal = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
      
      updateStreak('daily_target', todayTotal >= dailyTarget);
    }
  }, [tips, dailyTarget]);

  const dailyTargetStreak = getStreak('daily_target');

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink mb-2">🔥 Стреки</h2>
        <p className="text-muted">Дни подряд достижения дневной цели</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Текущий стрек */}
        <motion.div
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Текущий стрек</h3>
              <p className="text-orange-100">Дней подряд</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-black mb-2">
              {dailyTargetStreak?.currentStreak || 0}
            </div>
            <div className="text-orange-100 text-sm">
              {dailyTargetStreak?.currentStreak === 0 
                ? 'Начните достигать цели!' 
                : dailyTargetStreak?.currentStreak === 1 
                  ? 'Отличное начало!'
                  : `Продолжайте в том же духе!`
              }
            </div>
          </div>
        </motion.div>

        {/* Рекордный стрек */}
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Рекордный стрек</h3>
              <p className="text-purple-100">Лучший результат</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-black mb-2">
              {dailyTargetStreak?.longestStreak || 0}
            </div>
            <div className="text-purple-100 text-sm">
              {dailyTargetStreak?.longestStreak === 0 
                ? 'Пока нет рекордов'
                : dailyTargetStreak?.longestStreak === 1 
                  ? 'Первый шаг сделан!'
                  : `Впечатляющий результат!`
              }
            </div>
          </div>
        </motion.div>

        {/* Статистика */}
        <motion.div
          className="bg-card rounded-2xl p-6 border border-mint/20 shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-mint" />
            <h3 className="text-lg font-semibold text-ink">Статистика</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-mint">
                {dailyTargetStreak?.currentStreak || 0}
              </div>
              <div className="text-sm text-muted">Текущий</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mint">
                {dailyTargetStreak?.longestStreak || 0}
              </div>
              <div className="text-sm text-muted">Рекорд</div>
            </div>
          </div>
          
          {dailyTargetStreak?.lastAchievedDate && (
            <div className="mt-4 pt-4 border-t border-mint/20">
              <div className="text-sm text-muted text-center">
                Последний успех: {new Date(dailyTargetStreak.lastAchievedDate).toLocaleDateString('ru')}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Мотивационные сообщения */}
      {dailyTargetStreak && (
        <motion.div
          className="mt-6 p-4 bg-mint/10 rounded-xl border border-mint/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center">
            {dailyTargetStreak.currentStreak === 0 && (
              <div>
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-muted">Начните с достижения дневной цели сегодня!</p>
              </div>
            )}
            {dailyTargetStreak.currentStreak === 1 && (
              <div>
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-muted">Отличное начало! Продолжайте в том же духе!</p>
              </div>
            )}
            {dailyTargetStreak.currentStreak >= 2 && dailyTargetStreak.currentStreak < 7 && (
              <div>
                <div className="text-2xl mb-2">💪</div>
                <p className="text-muted">Отличная мотивация! Вы на правильном пути!</p>
              </div>
            )}
            {dailyTargetStreak.currentStreak >= 7 && dailyTargetStreak.currentStreak < 30 && (
              <div>
                <div className="text-2xl mb-2">🔥</div>
                <p className="text-muted">Невероятно! Вы создаете отличную привычку!</p>
              </div>
            )}
            {dailyTargetStreak.currentStreak >= 30 && (
              <div>
                <div className="text-2xl mb-2">👑</div>
                <p className="text-muted">Легендарно! Вы настоящий мастер!</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
