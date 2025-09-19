import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Clock, Target, Zap } from 'lucide-react';
import { useTips } from '../store/tips.store';
import { useSubscription } from '../store/subscription.store';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, getDay, getHours } from 'date-fns';
import { ru } from 'date-fns/locale';

export function AdvancedAnalytics() {
  const { tips } = useTips();
  const { hasFeature } = useSubscription();

  if (!hasFeature('advanced_analytics')) {
    return null;
  }

  // Анализ данных за последние 30 дней
  const last30Days = tips.filter(tip => {
    const tipDate = new Date(tip.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return tipDate >= thirtyDaysAgo;
  });

  // Группировка по дням недели
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const dayTips = last30Days.filter(tip => getDay(new Date(tip.createdAt)) === i);
    const total = dayTips.reduce((sum, tip) => sum + tip.amount, 0);
    const average = dayTips.length > 0 ? total / dayTips.length : 0;
    return {
      day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][i],
      total,
      average,
      count: dayTips.length
    };
  });

  // Группировка по часам
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hourTips = last30Days.filter(tip => getHours(new Date(tip.createdAt)) === i);
    const total = hourTips.reduce((sum, tip) => sum + tip.amount, 0);
    return {
      hour: i,
      total,
      count: hourTips.length
    };
  });

  // Тренды
  const weeklyTotals = Array.from({ length: 4 }, (_, weekIndex) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (weekIndex + 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekTips = last30Days.filter(tip => {
      const tipDate = new Date(tip.createdAt);
      return tipDate >= weekStart && tipDate <= weekEnd;
    });
    
    return weekTips.reduce((sum, tip) => sum + tip.amount, 0);
  });

  const trend = weeklyTotals.length > 1 
    ? ((weeklyTotals[0] - weeklyTotals[1]) / weeklyTotals[1] * 100)
    : 0;

  // Прогноз на следующую неделю
  const averageWeekly = weeklyTotals.reduce((sum, total) => sum + total, 0) / weeklyTotals.length;
  const forecast = Math.round(averageWeekly * 1.1); // +10% оптимистичный прогноз

  return (
    <motion.div
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700/50 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-purple-800 dark:text-purple-300">
            🚀 Расширенная аналитика
          </h2>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Детальные инсайты и прогнозы
          </p>
        </div>
      </div>

      {/* Тренды */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-purple-200 dark:border-purple-700/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Тренд</span>
          </div>
          <div className={`text-2xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            за последние 4 недели
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-purple-200 dark:border-purple-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Прогноз</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {forecast.toLocaleString()} ₽
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            на следующую неделю
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-purple-200 dark:border-purple-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Активность</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {last30Days.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            записей за 30 дней
          </div>
        </div>
      </motion.div>

      {/* График по дням недели */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          По дням недели
        </h3>
        <div className="space-y-3">
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.day}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            >
              <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                {day.day}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (day.total / Math.max(...weeklyData.map(d => d.total)) * 100))}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                />
              </div>
              <div className="w-20 text-right">
                <div className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                  {day.total.toLocaleString()} ₽
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {day.count} записей
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* График по часам */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          По часам дня
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {hourlyData.map((hour, index) => (
            <motion.div
              key={hour.hour}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.02, duration: 0.3 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {hour.hour}:00
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-t-lg h-16 flex items-end justify-center">
                <motion.div
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${Math.min(100, (hour.total / Math.max(...hourlyData.map(h => h.total)) * 100))}%` 
                  }}
                  transition={{ delay: 0.6 + index * 0.02, duration: 0.8 }}
                />
              </div>
              <div className="text-xs font-medium text-purple-800 dark:text-purple-300 mt-1">
                {hour.total > 0 ? `${hour.total.toLocaleString()} ₽` : '-'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
