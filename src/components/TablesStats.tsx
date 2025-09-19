import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, BarChart3, Trash2 } from 'lucide-react';
import { telegram } from '../lib/telegram';
import { format, startOfDay, addDays, subDays, getDay, getHours } from 'date-fns';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';

interface TablesStatsProps {
  onAddTable: () => void;
}

export function TablesStats({ onAddTable }: TablesStatsProps) {
  const { tips } = useTips();
  const { notificationsEnabled } = useSettings();
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
    
    const savedToday = localStorage.getItem(`tables_${today}`);
    const savedYesterday = localStorage.getItem(`tables_${yesterday}`);
    
    if (savedToday) setTodayTables(parseInt(savedToday));
    if (savedYesterday) setYesterdayTables(parseInt(savedYesterday));
    
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
    setTodayTables(0);
    setPendingTables(0);
    
    // Очищаем только сегодняшние данные
    localStorage.setItem(`tables_${today}`, '0');
    
    // Пересчитываем статистику
    calculateWeeklyAverage();
    calculateCorrelation();
    calculateTimeAnalysis();
    calculatePrediction();
    telegram.hapticLight();
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
    <div className="bg-gradient-to-br from-card to-mint/5 rounded-2xl p-5 shadow-lg border border-mint/30 mb-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint to-mint-soft flex items-center justify-center shadow-md">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">Управление столами</h3>
            <p className="text-xs text-muted">Добавляйте столы и отслеживайте статистику</p>
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
            <div className="text-2xl font-black text-mint">{pendingTables}</div>
            <div className="text-xs text-muted">ожидает</div>
          </div>
        </div>
      </div>
      
      {/* Описание работы статистики */}
      <div className="bg-blue-50/50 rounded-xl p-4 mb-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <div className="text-sm font-semibold text-blue-800 mb-2">Как работает статистика?</div>
            <div className="text-xs text-blue-700 space-y-1">
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
      <div className="bg-gradient-to-r from-mint/10 to-mint/5 rounded-xl p-3 mb-4 border border-mint/20 shadow-sm">
        <div className="text-xs font-semibold text-mint mb-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-mint to-mint-soft shadow-sm"></div>
          Быстрые действия
        </div>
        <div className="grid grid-cols-3 gap-2">
          <motion.button
            onClick={() => setPendingTables(prev => Math.max(0, prev - 1))}
            disabled={pendingTables === 0}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
              pendingTables === 0 
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200' 
                : 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 hover:text-green-800 border border-green-300 hover:border-green-400 shadow-sm hover:shadow-md'
            }`}
            whileHover={{ scale: pendingTables > 0 ? 1.03 : 1, y: pendingTables > 0 ? -1 : 0 }}
            whileTap={{ scale: pendingTables > 0 ? 0.97 : 1 }}
          >
            <div className="text-sm mb-1">➖</div>
            <div className="text-xs">-1</div>
          </motion.button>
          <motion.button
            onClick={() => addQuickTables(1)}
            className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 hover:text-green-800 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 border border-green-300 hover:border-green-400 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-sm mb-1">➕</div>
            <div className="text-xs">+1</div>
          </motion.button>
          <motion.button
            onClick={resetCounter}
            disabled={pendingTables === 0}
            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
              pendingTables === 0 
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200' 
                : 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 hover:text-green-800 border border-green-300 hover:border-green-400 shadow-sm hover:shadow-md'
            }`}
            whileHover={{ scale: pendingTables > 0 ? 1.03 : 1, y: pendingTables > 0 ? -1 : 0 }}
            whileTap={{ scale: pendingTables > 0 ? 0.97 : 1 }}
          >
            <div className="text-sm mb-1">🔄</div>
            <div className="text-xs">Сброс</div>
          </motion.button>
        </div>
      </div>

      
      {/* Статистика столов */}
      <div className="bg-gradient-to-br from-white/80 to-mint/5 rounded-xl p-4 mb-6 border border-mint/20 shadow-sm">
        <div className="text-sm font-semibold text-mint mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-mint to-mint-soft shadow-sm"></div>
          Статистика за день
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 text-center border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1.5 font-medium">Вчера</div>
            <div className="text-xl font-black text-gray-700">{yesterdayTables}</div>
            <div className="text-xs text-gray-500 mt-1">столов</div>
          </div>
          <div className="bg-gradient-to-br from-mint/20 to-mint/30 rounded-lg p-3 text-center border-2 border-mint/40 shadow-md">
            <div className="text-xs text-mint-soft mb-1.5 font-medium">Сегодня</div>
            <div className="text-xl font-black text-mint">{todayTables}</div>
            <div className="text-xs text-mint-soft mt-1">столов</div>
          </div>
        </div>
      </div>

      {/* Аналитика */}
      <div className="space-y-3">
        {/* Среднее за неделю */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-800 mb-1">Среднее за неделю</div>
              <div className="text-lg font-black text-blue-600">{weeklyAverage}</div>
              <div className="text-xs text-blue-600">столов в день</div>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>

        {/* Анализ эффективности */}
        {correlation && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-xl">💰</div>
              <div>
                <div className="text-xs font-semibold text-green-800 mb-1">Анализ эффективности</div>
                <div className="text-xs font-medium text-green-700">{correlation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Временной анализ */}
        {timeAnalysis && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-xl">⏰</div>
              <div>
                <div className="text-xs font-semibold text-cyan-800 mb-1">Временной анализ</div>
                <div className="text-xs font-medium text-cyan-700">{timeAnalysis}</div>
              </div>
            </div>
          </div>
        )}

        {/* Прогноз */}
        {prediction && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="text-xl">🔮</div>
              <div>
                <div className="text-xs font-semibold text-purple-800 mb-1">Прогноз на смену</div>
                <div className="text-xs font-medium text-purple-700">{prediction}</div>
              </div>
            </div>
          </div>
        )}

        {/* Напоминание */}
        {todayTables === 0 && (
          <motion.div
            className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="flex items-center gap-2">
              <div className="text-xl">⏰</div>
              <div>
                <div className="text-xs font-semibold text-yellow-800 mb-1">Напоминание</div>
                <div className="text-xs font-medium text-yellow-700">Не забыли добавить столы?</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Кнопка сброса статистики */}
        <motion.button
          onClick={resetTodayTables}
          className="w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 hover:text-red-700 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-300 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="text-sm">🗑️</div>
            <div>Сбросить статистику за сегодня</div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
