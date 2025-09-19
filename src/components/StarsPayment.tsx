import { motion } from 'framer-motion';
import { Star, Zap, CheckCircle } from 'lucide-react';
import { useSubscription } from '../store/subscription.store';
import { telegram } from '../lib/telegram';

export function StarsPayment() {
  const { subscription, upgradeWithStars, getPremiumPrice, resetSubscription } = useSubscription();
  
  const price = getPremiumPrice();

  const handleStarsPayment = async () => {
    try {
      // Показываем индикатор загрузки
      telegram.showPopup({
        title: 'Оплата звездами',
        message: 'Инициализируем платеж...',
        buttons: [{ id: 'cancel', type: 'cancel', text: 'Отмена' }]
      });

      // Инициализируем платеж через Telegram Stars API
      const result = await telegram.requestPayment({
        currency: 'XTR', // Telegram Stars
        amount: price.stars,
        description: `Premium подписка на 1 месяц - ${price.stars} звезд`,
        payload: JSON.stringify({
          type: 'premium_subscription',
          duration: '1_month',
          stars: price.stars
        })
      });

      if (result.status === 'succeeded') {
        // Активируем премиум подписку
        upgradeWithStars(price.stars);

        // Показываем успех
        telegram.showPopup({
          title: 'Успешно!',
          message: `Премиум активирован на 1 месяц за ${price.stars} звезд!`,
          buttons: [{ id: 'ok', type: 'default', text: 'Отлично!' }]
        });

        // Вибрация успеха
        telegram.hapticLight();
      } else {
        throw new Error('Платеж не прошел');
      }

    } catch (error) {
      console.error('Ошибка оплаты:', error);
      
      // Если не в Telegram, показываем инструкцию
      if (!telegram.isInTelegram()) {
        telegram.showPopup({
          title: 'Ошибка',
          message: 'Оплата звездами доступна только в Telegram. Откройте приложение через Telegram.',
          buttons: [{ id: 'ok', type: 'default', text: 'Понятно' }]
        });
      } else {
        telegram.showPopup({
          title: 'Ошибка оплаты',
          message: 'Не удалось обработать платеж. Попробуйте еще раз.',
          buttons: [{ id: 'retry', type: 'default', text: 'Повторить' }]
        });
      }
    }
  };


  if (subscription.tier === 'premium') {
    return (
      <motion.div
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-700/50 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
              ⭐ Премиум активен
            </h2>
            <p className="text-sm text-green-600 dark:text-green-400">
              Оплачено звездами • {subscription.starsAmount} ⭐
            </p>
          </div>
        </div>
        
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-green-200 dark:border-green-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              Все функции разблокированы!
            </div>
            <div className="text-sm text-green-600 dark:text-green-400 mb-4">
              Спасибо за поддержку! 🚀
            </div>
            <button
              onClick={resetSubscription}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Сбросить подписку (тест)
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-lg border border-yellow-200 dark:border-yellow-700/50 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">
            ⭐ Оплата звездами
          </h2>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Быстро, безопасно, без комиссий
          </p>
        </div>
      </div>

      {/* Цена в звездах */}
      <div className="flex justify-center mb-6">
        <motion.div
          className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700/50 text-center max-w-sm w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">
              {price.stars} звезд
            </span>
          </div>
          <div className="text-lg text-yellow-600 dark:text-yellow-400 mb-4">
            За 1 месяц Premium
          </div>
          <button
            onClick={handleStarsPayment}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
          >
            ⭐ Оплатить звездами
          </button>
        </motion.div>
      </div>

      {/* Преимущества */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
          🚀 Что включено:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Расширенная аналитика',
            'Экспорт данных',
            'Умные уведомления',
            'Кастомные темы',
            'Облачная синхронизация',
            'Приоритетная поддержка'
          ].map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              {feature}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Информация о звездах */}
      <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
        <div className="text-sm text-yellow-800 dark:text-yellow-300">
          <strong>💡 О звездах:</strong> Звезды — это внутренняя валюта Telegram. 
          Вы можете купить их в настройках Telegram или получить за активность.
        </div>
      </div>
    </motion.div>
  );
}
