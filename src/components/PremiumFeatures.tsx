import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Download, 
  Bell, 
  Palette, 
  Cloud, 
  Headphones,
  Lock,
  CheckCircle
} from 'lucide-react';
import { useSubscription } from '../store/subscription.store';
import { Star } from 'lucide-react';

const premiumFeatures = [
  {
    id: 'advanced_analytics',
    title: 'Расширенная аналитика',
    description: 'Детальные графики, тренды и прогнозы',
    icon: BarChart3,
    color: 'blue'
  },
  {
    id: 'export_data',
    title: 'Экспорт данных',
    description: 'CSV, PDF отчеты и резервное копирование',
    icon: Download,
    color: 'green'
  },
  {
    id: 'smart_notifications',
    title: 'Умные уведомления',
    description: 'Персональные советы и мотивация',
    icon: Bell,
    color: 'purple'
  },
  {
    id: 'custom_themes',
    title: 'Кастомные темы',
    description: 'Неограниченное количество цветовых схем',
    icon: Palette,
    color: 'pink'
  },
  {
    id: 'cloud_sync',
    title: 'Облачная синхронизация',
    description: 'Данные на всех устройствах',
    icon: Cloud,
    color: 'cyan'
  },
  {
    id: 'priority_support',
    title: 'Приоритетная поддержка',
    description: 'Быстрые ответы и помощь',
    icon: Headphones,
    color: 'orange'
  }
];

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  cyan: 'from-cyan-500 to-cyan-600',
  orange: 'from-orange-500 to-orange-600'
};

export function PremiumFeatures() {
  const { hasFeature, getPremiumPrice } = useSubscription();
  const price = getPremiumPrice();

  return (
    <motion.div
      className="bg-gradient-to-br from-card to-mint/5 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-mint/30 dark:border-gray-700 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-ink dark:text-gray-100 mb-2">
          🚀 Premium функции
        </h2>
        <p className="text-muted dark:text-gray-400">
          Разблокируйте полный потенциал приложения
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {premiumFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          const isUnlocked = hasFeature(feature.id);
          
          return (
            <motion.div
              key={feature.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' 
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isUnlocked 
                    ? `bg-gradient-to-r ${colorClasses[feature.color as keyof typeof colorClasses]} text-white` 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {isUnlocked ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    isUnlocked 
                      ? 'text-green-800 dark:text-green-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${
                    isUnlocked 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!hasFeature('advanced_analytics') && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">
              Получите Premium прямо сейчас!
            </h3>
            <p className="text-purple-100 mb-4">
              Полный доступ ко всем функциям на 1 месяц
            </p>
            
            {/* Цена в звездах */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-3">
                <Star className="w-6 h-6 text-yellow-300" />
                <span className="text-xl font-bold text-yellow-300">{price.stars} звезд</span>
              </div>
            </div>
            
            <div className="text-center text-purple-200">
              Используйте форму оплаты выше ⬆️
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
