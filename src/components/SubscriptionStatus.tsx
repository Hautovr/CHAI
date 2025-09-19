import { motion } from 'framer-motion';
import { Crown, Star, Clock, CheckCircle } from 'lucide-react';
import { useSubscription } from '../store/subscription.store';

export function SubscriptionStatus() {
  const { 
    subscription
  } = useSubscription();

  if (subscription.tier === 'free') {
    return (
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                Бесплатная версия
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Базовый функционал
              </p>
            </div>
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Прокрутите вниз для оплаты
          </div>
        </div>
      </motion.div>
    );
  }


  if (subscription.tier === 'premium' && subscription.status === 'active') {
    return (
      <motion.div
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700/50 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Crown className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                Premium активен
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Все функции доступны
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-green-800 dark:text-green-300 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Активна
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              Спасибо за поддержку!
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
