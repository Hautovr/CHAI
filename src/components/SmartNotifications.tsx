import { motion } from 'framer-motion';
import { Bell, Lightbulb, Target, TrendingUp, Clock, Star, Zap } from 'lucide-react';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';
import { useSubscription } from '../store/subscription.store';
import { format, startOfDay, endOfDay, getHours, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export function SmartNotifications() {
  const { tips } = useTips();
  const { dailyTarget } = useSettings();
  const { hasFeature } = useSubscription();
  const [notifications, setNotifications] = useState<string[]>([]);

  if (!hasFeature('smart_notifications')) {
    return null;
  }

  useEffect(() => {
    generateSmartNotifications();
  }, [tips, dailyTarget]);

  const generateSmartNotifications = () => {
    const newNotifications: string[] = [];
    const now = new Date();
    const today = tips.filter(tip => {
      const tipDate = new Date(tip.createdAt);
      return tipDate >= startOfDay(now) && tipDate <= endOfDay(now);
    });

    const todayTotal = today.reduce((sum, tip) => sum + tip.amount, 0);
    const currentHour = getHours(now);
    const currentDay = getDay(now);

    // Анализ производительности
    if (dailyTarget) {
      const progress = (todayTotal / dailyTarget) * 100;
      
      if (progress >= 100) {
        newNotifications.push("🎉 Отличная работа! Цель на день достигнута!");
      } else if (progress >= 75) {
        newNotifications.push("💪 Почти у цели! Осталось совсем немного!");
      } else if (progress >= 50) {
        newNotifications.push("📈 Хороший прогресс! Продолжайте в том же духе!");
      } else if (progress < 25 && currentHour >= 14) {
        newNotifications.push("⏰ Время активизироваться! Цель еще далеко.");
      }
    }

    // Анализ времени
    if (currentHour >= 6 && currentHour <= 10) {
      newNotifications.push("🌅 Доброе утро! Время начать продуктивный день!");
    } else if (currentHour >= 11 && currentHour <= 14) {
      newNotifications.push("☀️ Обеденное время - пик активности! Не упустите возможности!");
    } else if (currentHour >= 15 && currentHour <= 18) {
      newNotifications.push("🌆 Послеобеденное время - отличный момент для чаевых!");
    } else if (currentHour >= 19 && currentHour <= 22) {
      newNotifications.push("🌙 Вечернее время - финальный рывок к цели!");
    }

    // Анализ дней недели
    if (currentDay === 1) { // Понедельник
      newNotifications.push("💼 Понедельник - день новых возможностей! Начните неделю с энтузиазмом!");
    } else if (currentDay === 5) { // Пятница
      newNotifications.push("🎊 Пятница! Завершите неделю на высокой ноте!");
    } else if (currentDay === 6 || currentDay === 0) { // Выходные
      newNotifications.push("🏖️ Выходные - время для отдыха и подведения итогов!");
    }

    // Анализ трендов
    const last7Days = tips.filter(tip => {
      const tipDate = new Date(tip.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tipDate >= weekAgo;
    });

    if (last7Days.length > 0) {
      const weeklyAverage = last7Days.reduce((sum, tip) => sum + tip.amount, 0) / 7;
      const todayAverage = todayTotal / Math.max(today.length, 1);
      
      if (todayAverage > weeklyAverage * 1.2) {
        newNotifications.push("🚀 Сегодня вы работаете на 20% лучше среднего! Продолжайте!");
      } else if (todayAverage < weeklyAverage * 0.8) {
        newNotifications.push("💡 Попробуйте новые подходы - сегодня ниже среднего.");
      }
    }

    // Мотивационные сообщения
    const motivationalMessages = [
      "✨ Каждая запись - это шаг к вашей цели!",
      "🎯 Помните: постоянство - ключ к успеху!",
      "💎 Ваши усилия сегодня - это инвестиции в завтра!",
      "🌟 Каждый день - новая возможность превзойти себя!",
      "🔥 Не останавливайтесь на достигнутом!",
      "💪 Трудности делают нас сильнее!",
      "🎊 Празднуйте каждый маленький успех!",
      "🌈 За каждым облаком скрывается солнце!"
    ];

    if (Math.random() < 0.3) { // 30% шанс показать мотивационное сообщение
      newNotifications.push(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    }

    setNotifications(newNotifications.slice(0, 5)); // Максимум 5 уведомлений
  };

  const getNotificationIcon = (notification: string) => {
    if (notification.includes('🎉') || notification.includes('🚀')) return Star;
    if (notification.includes('💪') || notification.includes('🔥')) return Zap;
    if (notification.includes('⏰') || notification.includes('🌅')) return Clock;
    if (notification.includes('📈') || notification.includes('💡')) return TrendingUp;
    if (notification.includes('🎯') || notification.includes('💎')) return Target;
    return Lightbulb;
  };

  const getNotificationColor = (notification: string) => {
    if (notification.includes('🎉') || notification.includes('🚀')) return 'from-green-500 to-emerald-500';
    if (notification.includes('💪') || notification.includes('🔥')) return 'from-red-500 to-pink-500';
    if (notification.includes('⏰') || notification.includes('🌅')) return 'from-blue-500 to-cyan-500';
    if (notification.includes('📈') || notification.includes('💡')) return 'from-purple-500 to-indigo-500';
    if (notification.includes('🎯') || notification.includes('💎')) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-700/50 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">
            🔔 Умные уведомления
          </h2>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Персональные советы и мотивация
          </p>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => {
            const IconComponent = getNotificationIcon(notification);
            const colorClass = getNotificationColor(notification);
            
            return (
              <motion.div
                key={index}
                className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700/50 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -1 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {notification}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-yellow-600 dark:text-yellow-400">
            Анализируем ваши данные...
          </p>
          <p className="text-sm text-yellow-500 dark:text-yellow-500 mt-1">
            Персональные советы появятся здесь
          </p>
        </motion.div>
      )}

      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-300 dark:border-yellow-600/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
            Как это работает?
          </span>
        </div>
        <p className="text-xs text-yellow-700 dark:text-yellow-400">
          ИИ анализирует ваши данные, время дня, прогресс к цели и выдает персональные советы для максимальной эффективности!
        </p>
      </motion.div>
    </motion.div>
  );
}
