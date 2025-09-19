import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, BarChart3, Trash2 } from 'lucide-react';
import { telegram } from '../lib/telegram';
import { format, startOfDay, addDays, subDays, getDay, getHours } from 'date-fns';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';
import { useSubscription } from '../store/subscription.store';

interface TablesStatsProps {
  onAddTable: () => void;
}

export function TablesStats({ onAddTable }: TablesStatsProps) {
  const { tips } = useTips();
  const { notificationsEnabled } = useSettings();
  const { hasFeature } = useSubscription();
  const [todayTables, setTodayTables] = useState(0);
  const [yesterdayTables, setYesterdayTables] = useState(0);
  const [pendingTables, setPendingTables] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [correlation, setCorrelation] = useState<string>('');
  const [prediction, setPrediction] = useState<string>('');
  const [timeAnalysis, setTimeAnalysis] = useState<string>('');

  // Загружаем статистику столов из localStorage
  useEffect(() => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const yesterday = format(startOfDay(subDays(new Date(), 1)), 'yyyy-MM-dd');
    
    console.log('📊 Загрузка статистики столов:', { today, yesterday });
    
    const savedToday = localStorage.getItem(`tables_${today}`);
    const savedYesterday = localStorage.getItem(`tables_${yesterday}`);
    
    console.log('💾 Данные из localStorage:', { savedToday, savedYesterday });
    
    if (savedToday) {
      const todayCount = parseInt(savedToday);
      setTodayTables(todayCount);
      console.log('✅ Загружены столы за сегодня:', todayCount);
    }
    if (savedYesterday) {
      const yesterdayCount = parseInt(savedYesterday);
      setYesterdayTables(yesterdayCount);
      console.log('✅ Загружены столы за вчера:', yesterdayCount);
    }
    
    // Вычисляем среднее за неделю
    calculateWeeklyAverage();
    // Вычисляем аналитику
    setTimeout(() => {
      calculateCorrelation();
      calculateTimeAnalysis();
      calculatePrediction();
    }, 100);
  }, []);

  // Автоматическое сохранение каждые 5 минут
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingTables > 0) {
        console.log('💾 Автоматическое сохранение столов...');
        // Здесь можно добавить автосохранение
      }
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [pendingTables]);

  // Уведомления каждые полчаса
  useEffect(() => {
    // Проверяем, включены ли уведомления
    if (!notificationsEnabled) return;

    const notificationInterval = setInterval(() => {
      const now = new Date();
      const currentHour = getHours(now);
      
      // Показываем уведомления 24/7
      let message = '';
      let shouldNotify = false;
      
      // Получаем чаевые за сегодня
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
      const todayTips = tips.filter(tip => 
        format(startOfDay(new Date(tip.createdAt)), 'yyyy-MM-dd') === today
      );
      const todayTipsAmount = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
      
      // Умные уведомления в зависимости от времени и суммы чаевых
      if (todayTipsAmount === 0) {
        if (currentHour >= 6 && currentHour < 12) {
          message = '🌅 Доброе утро! Начните день с добавления чаевых';
          shouldNotify = true;
        } else if (currentHour >= 12 && currentHour < 18) {
          message = '☀️ Дневная смена: не забудьте добавить чаевые';
          shouldNotify = true;
        } else if (currentHour >= 18 && currentHour < 22) {
          message = '🌆 Вечерняя смена: пиковое время для чаевых!';
          shouldNotify = true;
        } else if (currentHour >= 22 || currentHour < 6) {
          message = '🌙 Ночная смена: не забудьте добавить чаевые';
          shouldNotify = true;
        }
      } else if (todayTipsAmount < 1000) {
        // Если чаевых мало, напоминаем о продолжении работы
        if (currentHour >= 14 && currentHour < 20) {
          message = `💰 У вас ${todayTipsAmount}₽ чаевых. Продолжайте в том же духе!`;
          shouldNotify = true;
        }
      }
      
      if (shouldNotify && message) {
        // Haptic feedback
        telegram.hapticLight();
        
        // Логируем уведомление
        console.log('🔔 Напоминание:', message);
        
        // Простое уведомление через alert (для тестирования)
        // alert(message);
      }
    }, 30 * 60 * 1000); // 30 минут

    return () => clearInterval(notificationInterval);
  }, [tips, notificationsEnabled]);

  const calculateWeeklyAverage = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(startOfDay(subDays(new Date(), i)), 'yyyy-MM-dd')
    );
    
    let totalTables = 0;
    let daysWithData = 0;
    
    last7Days.forEach(day => {
      const saved = localStorage.getItem(`tables_${day}`);
      if (saved) {
        totalTables += parseInt(saved);
        daysWithData++;
      }
    });
    
    setWeeklyAverage(daysWithData > 0 ? Math.round(totalTables / daysWithData) : 0);
  };

  const calculateCorrelation = () => {
    // Анализ чаевых - сравнение с реальными суммами
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const todayTips = tips.filter(tip => 
      format(startOfDay(new Date(tip.createdAt)), 'yyyy-MM-dd') === today
    );
    
    const todayTipsAmount = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
    const avgTipsPerTable = todayTables > 0 ? todayTipsAmount / todayTables : 0;
    
    // Анализ за последние 7 дней
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(startOfDay(subDays(new Date(), i)), 'yyyy-MM-dd')
    );
    
    let totalTips7Days = 0;
    let totalTables7Days = 0;
    
    last7Days.forEach(day => {
      const dayTips = tips.filter(tip => 
        format(startOfDay(new Date(tip.createdAt)), 'yyyy-MM-dd') === day
      );
      const dayTables = parseInt(localStorage.getItem(`tables_${day}`) || '0');
      
      totalTips7Days += dayTips.reduce((sum, tip) => sum + tip.amount, 0);
      totalTables7Days += dayTables;
    });
    
    const avgTipsPerTable7Days = totalTables7Days > 0 ? totalTips7Days / totalTables7Days : 0;
    
    // Корреляция
    if (avgTipsPerTable > avgTipsPerTable7Days * 1.2) {
      setCorrelation(`💰 Отличная работа! ${Math.round(avgTipsPerTable)}₽/стол (обычно ${Math.round(avgTipsPerTable7Days)}₽)`);
    } else if (avgTipsPerTable > avgTipsPerTable7Days * 0.8) {
      setCorrelation(`📊 Стандартная эффективность: ${Math.round(avgTipsPerTable)}₽/стол`);
    } else {
      setCorrelation(`📉 Можно лучше: ${Math.round(avgTipsPerTable)}₽/стол (обычно ${Math.round(avgTipsPerTable7Days)}₽)`);
    }
  };

  const calculateTimeAnalysis = () => {
    // Временные тренды - учет времени дня, дня недели
    const now = new Date();
    const currentHour = getHours(now);
    const currentDay = getDay(now); // 0 = воскресенье, 1 = понедельник
    
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const currentDayName = dayNames[currentDay];
    
    // Анализ по времени дня
    let timeMessage = '';
    if (currentHour >= 6 && currentHour < 12) {
      timeMessage = '🌅 Утренняя смена - обычно меньше столов, но больше чаевых';
    } else if (currentHour >= 12 && currentHour < 18) {
      timeMessage = '☀️ Дневная смена - стабильная работа';
    } else if (currentHour >= 18 && currentHour < 22) {
      timeMessage = '🌆 Вечерняя смена - пиковое время, много столов';
    } else {
      timeMessage = '🌙 Ночная смена - особый режим работы';
    }
    
    // Анализ по дню недели
    let dayMessage = '';
    if (currentDay >= 1 && currentDay <= 5) {
      dayMessage = '📅 Будний день - обычная активность';
    } else if (currentDay === 6) {
      dayMessage = '🎉 Суббота - повышенная активность';
    } else {
      dayMessage = '🏖️ Воскресенье - семейный день, много столов';
    }
    
    setTimeAnalysis(`${timeMessage} | ${dayMessage}`);
  };

  const calculatePrediction = () => {
    // Прогнозы - предсказание потенциальных чаевых
    const now = new Date();
    const currentHour = getHours(now);
    const remainingHours = Math.max(0, 22 - currentHour); // Работаем до 22:00
    
    console.log('🔮 Прогноз столов:', {
      currentHour,
      remainingHours,
      now: now.toLocaleTimeString()
    });
    
    // Средняя эффективность за последние 7 дней
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(startOfDay(subDays(new Date(), i)), 'yyyy-MM-dd')
    );
    
    let totalTips7Days = 0;
    let totalTables7Days = 0;
    
    last7Days.forEach(day => {
      const dayTips = tips.filter(tip => 
        format(startOfDay(new Date(tip.createdAt)), 'yyyy-MM-dd') === day
      );
      const dayTables = parseInt(localStorage.getItem(`tables_${day}`) || '0');
      
      totalTips7Days += dayTips.reduce((sum, tip) => sum + tip.amount, 0);
      totalTables7Days += dayTables;
      
      console.log(`📊 День ${day}:`, {
        tips: dayTips.length,
        tipsAmount: dayTips.reduce((sum, tip) => sum + tip.amount, 0),
        tables: dayTables
      });
    });
    
    const avgTipsPerTable = totalTables7Days > 0 ? totalTips7Days / totalTables7Days : 0;
    const avgTablesPerHour = totalTables7Days / (7 * 16); // 16 часов работы в день
    
    console.log('📈 Статистика за 7 дней:', {
      totalTips7Days,
      totalTables7Days,
      avgTipsPerTable: Math.round(avgTipsPerTable),
      avgTablesPerHour: Math.round(avgTablesPerHour * 100) / 100
    });
    
    // Прогноз
    const predictedTables = Math.round(avgTablesPerHour * remainingHours);
    const predictedTips = Math.round(predictedTables * avgTipsPerTable);
    
    console.log('🔮 Результат прогноза:', {
      predictedTables,
      predictedTips,
      remainingHours
    });
    
    if (predictedTables > 0) {
      setPrediction(`🔮 Прогноз: ~${predictedTables} столов, ~${predictedTips}₽ чаевых до конца смены`);
    } else {
      setPrediction('🏁 Смена завершена! Отличная работа!');
    }
  };

  const addPendingTable = () => {
    setPendingTables(prev => prev + 1);
    telegram.hapticLight();
  };

  const confirmTables = () => {
    if (pendingTables > 0) {
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
      const newToday = todayTables + pendingTables;
      
      setTodayTables(newToday);
      localStorage.setItem(`tables_${today}`, newToday.toString());
      
      setPendingTables(0);
      telegram.hapticLight();
      onAddTable();
      
      // Пересчитываем статистику
      calculateWeeklyAverage();
      calculateCorrelation();
      calculateTimeAnalysis();
      calculatePrediction();
    }
  };

  // Быстрые действия
  const addQuickTables = (count: number) => {
    setPendingTables(prev => prev + count);
    telegram.hapticLight();
  };

  const resetCounter = () => {
    setPendingTables(0);
    telegram.hapticLight();
  };

  const resetTodayTables = () => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    
    console.log('🗑️ Сброс статистики за сегодня:', today);
    
    // Сбрасываем состояние
    setTodayTables(0);
    setPendingTables(0);
    
    // Очищаем только сегодняшние данные
    localStorage.setItem(`tables_${today}`, '0');
    
    // Пересчитываем статистику
    calculateWeeklyAverage();
    calculateCorrelation();
    calculateTimeAnalysis();
    calculatePrediction();
    
    // Haptic feedback
    telegram.hapticLight();
    
    console.log('✅ Статистика за сегодня сброшена');
  };

  const removeTable = () => {
    if (todayTables > 0) {
      const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
      const newToday = Math.max(0, todayTables - 1);
      
      setTodayTables(newToday);
      localStorage.setItem(`tables_${today}`, newToday.toString());
      
      telegram.hapticLight();
    }
  };

  const resetStats = () => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    setTodayTables(0);
    localStorage.setItem(`tables_${today}`, '0');
    telegram.hapticLight();
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-card to-mint/5 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-mint/30 dark:border-gray-700 mb-4"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.2,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {/* Заголовок */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint to-mint-soft flex items-center justify-center shadow-md">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink dark:text-gray-100">Управление столами</h3>
            <p className="text-xs text-muted dark:text-gray-400">Добавляйте столы и отслеживайте статистику</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {pendingTables > 0 && (
            <motion.button
              onClick={confirmTables}
              className="w-12 h-12 bg-green-500/20 hover:bg-green-500/30 text-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-green-400/50 hover:border-green-400 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5, boxShadow: "0 8px 20px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-xl">✅</div>
            </motion.button>
          )}
          <div className="text-center">
            <div className="text-2xl font-black text-mint dark:text-mint-soft">{pendingTables}</div>
            <div className="text-xs text-muted dark:text-gray-400">ожидает</div>
          </div>
        </div>
      </motion.div>
      
      {/* Описание работы статистики */}
      <div className="bg-green-50/50 dark:bg-green-900/20 rounded-xl p-4 mb-4 border border-green-200 dark:border-green-700/50">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Как работает статистика?</div>
            <div className="text-xs text-gray-800 dark:text-gray-200 space-y-1">
              <div>• <strong>Среднее за неделю</strong> - автоматический расчет по 7 дням</div>
              <div>• <strong>Анализ эффективности</strong> - сравнение ₽/стол с предыдущими днями</div>
              <div>• <strong>Временной анализ</strong> - учет времени дня и дня недели</div>
              <div>• <strong>Прогноз на смену</strong> - предсказание столов до 22:00</div>
              <div>• <strong>Корреляция с чаевыми</strong> - связь количества столов и суммы чаевых</div>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <motion.div 
        className="bg-gradient-to-r from-mint/20 to-mint/15 dark:from-mint/30 dark:to-mint/20 rounded-xl p-3 mb-4 border border-mint/30 dark:border-mint/40 shadow-sm backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="text-sm font-bold text-black dark:text-white mb-2 flex items-center gap-2 drop-shadow-lg bg-white/80 dark:bg-black/80 px-2 py-1 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-mint to-mint-soft shadow-sm"></div>
          Быстрые действия
        </div>
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            onClick={() => setPendingTables(prev => Math.max(0, prev - 1))}
            disabled={pendingTables === 0}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
              pendingTables === 0 
                ? 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 cursor-not-allowed border border-gray-300/70 dark:border-gray-600/70 backdrop-blur-sm' 
                : 'bg-gradient-to-br from-green-100/80 to-green-200/60 dark:from-green-800/40 dark:to-green-700/30 hover:from-green-200/90 hover:to-green-300/70 dark:hover:from-green-700/50 dark:hover:to-green-600/40 text-green-800 dark:text-gray-900 hover:text-green-900 dark:hover:text-gray-800 border border-green-400/60 dark:border-green-500/50 hover:border-green-500/80 dark:hover:border-green-400/60 shadow-sm hover:shadow-md backdrop-blur-sm'
            }`}
            whileHover={{ scale: pendingTables > 0 ? 1.03 : 1, y: pendingTables > 0 ? -1 : 0 }}
            whileTap={{ scale: pendingTables > 0 ? 0.97 : 1 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="text-sm mb-1">➖</div>
            <div className="text-xs">-1</div>
          </motion.button>
          <motion.button
            onClick={() => addQuickTables(1)}
            className="bg-gradient-to-br from-green-100/80 to-green-200/60 dark:from-green-800/40 dark:to-green-700/30 hover:from-green-200/90 hover:to-green-300/70 dark:hover:from-green-700/50 dark:hover:to-green-600/40 text-green-800 dark:text-gray-900 hover:text-green-900 dark:hover:text-gray-800 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 border border-green-400/60 dark:border-green-500/50 hover:border-green-500/80 dark:hover:border-green-400/60 shadow-sm hover:shadow-md backdrop-blur-sm"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="text-sm mb-1">➕</div>
            <div className="text-xs">+1</div>
          </motion.button>
          <motion.button
            onClick={resetCounter}
            disabled={pendingTables === 0}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
              pendingTables === 0 
                ? 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400 cursor-not-allowed border border-gray-300/70 dark:border-gray-600/70 backdrop-blur-sm' 
                : 'bg-gradient-to-br from-green-100/80 to-green-200/60 dark:from-green-800/40 dark:to-green-700/30 hover:from-green-200/90 hover:to-green-300/70 dark:hover:from-green-700/50 dark:hover:to-green-600/40 text-green-800 dark:text-gray-900 hover:text-green-900 dark:hover:text-gray-800 border border-green-400/60 dark:border-green-500/50 hover:border-green-500/80 dark:hover:border-green-400/60 shadow-sm hover:shadow-md backdrop-blur-sm'
            }`}
            whileHover={{ scale: pendingTables > 0 ? 1.03 : 1, y: pendingTables > 0 ? -1 : 0 }}
            whileTap={{ scale: pendingTables > 0 ? 0.97 : 1 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="text-sm mb-1">🔄</div>
            <div className="text-xs">Сброс</div>
          </motion.button>
        </div>
      </motion.div>

      
      {/* Статистика столов */}
      <motion.div 
        className="bg-gradient-to-br from-green-50/40 to-green-100/30 dark:from-green-900/20 dark:to-green-800/15 rounded-xl p-4 mb-6 border border-green-200/30 dark:border-green-700/30 shadow-sm backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-sm"></div>
          Статистика за день
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-white/40 to-gray-50/50 dark:from-gray-800/40 dark:to-gray-700/50 rounded-lg p-3 text-center border border-green-300/20 dark:border-green-600/20 shadow-sm backdrop-blur-sm">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1.5 font-medium">Вчера</div>
            <div className="text-xl font-black text-gray-700 dark:text-gray-200">{yesterdayTables}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">столов</div>
          </div>
          <div className="bg-gradient-to-br from-green-200/25 to-green-300/20 dark:from-green-700/25 dark:to-green-600/20 rounded-lg p-3 text-center border-2 border-green-400/30 dark:border-green-500/30 shadow-md backdrop-blur-sm">
            <div className="text-xs text-green-700 dark:text-green-300 mb-1.5 font-medium">Сегодня</div>
            <div className="text-xl font-black text-green-800 dark:text-green-200">{todayTables}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">столов</div>
          </div>
        </div>
      </motion.div>

      {/* Аналитика */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        {/* Премиум аналитика */}
        {hasFeature('advanced_analytics') && (
          <motion.div
            className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/50 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xl">🚀</div>
              <div className="text-xs font-semibold text-purple-800 dark:text-purple-300">
                Premium аналитика
              </div>
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-400">
              Расширенные инсайты и прогнозы доступны
            </div>
          </motion.div>
        )}
        {/* Среднее за неделю */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">Среднее за неделю</div>
              <div className="text-lg font-black text-blue-600 dark:text-blue-400">{weeklyAverage}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">столов в день</div>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        {/* Анализ эффективности */}
        {correlation && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg p-3 border border-green-200 dark:border-green-700/50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-xl">💰</div>
              <div>
                <div className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">Анализ эффективности</div>
                <div className="text-xs font-medium text-green-700 dark:text-green-400">{correlation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Временной анализ */}
        {timeAnalysis && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700/50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-xl">⏰</div>
              <div>
                <div className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 mb-1">Временной анализ</div>
                <div className="text-xs font-medium text-cyan-700 dark:text-cyan-400">{timeAnalysis}</div>
              </div>
            </div>
          </div>
        )}

        {/* Прогноз */}
        {prediction && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-700/50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-xl">🔮</div>
              <div>
                <div className="text-xs font-semibold text-purple-800 dark:text-purple-300 mb-1">Прогноз на смену</div>
                <div className="text-xs font-medium text-purple-700 dark:text-purple-400">{prediction}</div>
              </div>
            </div>
          </div>
        )}

        {/* Напоминание */}
        {todayTables === 0 && (
          <motion.div
            className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700/50 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="flex items-center gap-2">
              <div className="text-xl">⏰</div>
              <div>
                <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Напоминание</div>
                <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Не забыли добавить столы?</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Кнопка сброса статистики */}
        <motion.button
          onClick={() => {
            console.log('🖱️ Клик по кнопке сброса статистики');
            resetTodayTables();
          }}
          className="w-full bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40 text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-300 border border-red-200 dark:border-red-700/50 hover:border-red-300 dark:hover:border-red-600/50 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="text-sm">🗑️</div>
            <div>Сбросить статистику за сегодня</div>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
