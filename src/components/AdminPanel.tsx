import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../store/subscription.store';
import { useTips } from '../store/tips.store';
import { useShifts } from '../store/shifts.store';
import { useAchievements } from '../store/achievements.store';
import { useTables } from '../store/tables.store';
import { useSettings } from '../store/settings.store';
import { useThemes } from '../store/themes.store';
import { Trash2, RotateCcw, Database, AlertTriangle } from 'lucide-react';

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetType, setResetType] = useState<'subscription' | 'all' | 'tables' | 'achievements'>('subscription');

  const { resetSubscription } = useSubscription();
  const { clearAllTips } = useTips();
  const { clearAllShifts } = useShifts();
  const { resetAchievements } = useAchievements();
  const { resetAllTables } = useTables();
  const { resetSettings } = useSettings();
  const { resetThemes } = useThemes();

  const handleReset = async () => {
    try {
      switch (resetType) {
        case 'subscription':
          await resetSubscription();
          break;
        case 'tables':
          await resetAllTables();
          break;
        case 'achievements':
          await resetAchievements();
          break;
        case 'all':
          await resetSubscription();
          await clearAllTips();
          await clearAllShifts();
          await resetAchievements();
          await resetAllTables();
          await resetSettings();
          await resetThemes();
          break;
      }
      
      setConfirmReset(false);
      setIsOpen(false);
      alert(`✅ Сброс ${resetType === 'all' ? 'всех данных' : resetType} выполнен успешно!`);
    } catch (error) {
      console.error('Ошибка сброса:', error);
      alert('❌ Ошибка при сбросе данных');
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
          title="Админская панель"
        >
          <AlertTriangle className="w-6 h-6" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            🔧 Админская панель
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {!confirmReset ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Выберите тип сброса данных:
            </p>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="resetType"
                  value="subscription"
                  checked={resetType === 'subscription'}
                  onChange={(e) => setResetType(e.target.value as any)}
                  className="text-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    💳 Сбросить подписки
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Все пользователи вернутся на бесплатный тариф
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="resetType"
                  value="tables"
                  checked={resetType === 'tables'}
                  onChange={(e) => setResetType(e.target.value as any)}
                  className="text-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    🪑 Сбросить статистику столов
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Обнулить счетчики столов у всех
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="resetType"
                  value="achievements"
                  checked={resetType === 'achievements'}
                  onChange={(e) => setResetType(e.target.value as any)}
                  className="text-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    🏆 Сбросить достижения
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Обнулить все достижения и стреки
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="resetType"
                  value="all"
                  checked={resetType === 'all'}
                  onChange={(e) => setResetType(e.target.value as any)}
                  className="text-red-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    🗑️ Полный сброс
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Удалить ВСЕ данные приложения
                  </div>
                </div>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => setConfirmReset(true)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Продолжить
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                ⚠️ Подтверждение сброса
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Вы уверены, что хотите сбросить{' '}
                {resetType === 'all' ? 'ВСЕ данные' : resetType}?
                <br />
                <span className="text-red-500 font-medium">
                  Это действие нельзя отменить!
                </span>
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Сбросить</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
