import { motion } from 'framer-motion';
import { Cloud, CloudOff, Upload, Download, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useSubscription } from '../store/subscription.store';
import { useState, useEffect } from 'react';

export function CloudSync() {
  const { hasFeature } = useSubscription();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  if (!hasFeature('cloud_sync')) {
    return null;
  }

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Симуляция последней синхронизации
    setLastSync(new Date());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    // Симуляция синхронизации
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLastSync(new Date());
    setIsSyncing(false);
    setSyncStatus('success');

    // Сброс статуса через 3 секунды
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleUpload = async () => {
    if (!isOnline) return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    // Симуляция загрузки
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLastSync(new Date());
    setIsSyncing(false);
    setSyncStatus('success');

    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleDownload = async () => {
    if (!isOnline) return;

    setIsSyncing(true);
    setSyncStatus('syncing');

    // Симуляция скачивания
    await new Promise(resolve => setTimeout(resolve, 1500));

    setLastSync(new Date());
    setIsSyncing(false);
    setSyncStatus('success');

    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const getSyncStatusText = () => {
    if (!isOnline) return 'Нет подключения к интернету';
    if (isSyncing) return 'Синхронизация...';
    if (syncStatus === 'success') return 'Синхронизация завершена';
    if (lastSync) return `Последняя синхронизация: ${lastSync.toLocaleTimeString()}`;
    return 'Данные не синхронизированы';
  };

  const getSyncStatusColor = () => {
    if (!isOnline) return 'text-red-600 dark:text-red-400';
    if (isSyncing) return 'text-blue-600 dark:text-blue-400';
    if (syncStatus === 'success') return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getSyncStatusIcon = () => {
    if (!isOnline) return WifiOff;
    if (isSyncing) return Cloud;
    if (syncStatus === 'success') return CheckCircle;
    return CloudOff;
  };

  const SyncStatusIcon = getSyncStatusIcon();

  return (
    <motion.div
      className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 shadow-lg border border-cyan-200 dark:border-cyan-700/50 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
          <Cloud className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-800 dark:text-cyan-300">
            ☁️ Облачная синхронизация
          </h2>
          <p className="text-sm text-cyan-600 dark:text-cyan-400">
            Данные на всех устройствах
          </p>
        </div>
      </div>

      {/* Статус синхронизации */}
      <motion.div
        className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-cyan-200 dark:border-cyan-700/50 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            !isOnline ? 'bg-red-100 dark:bg-red-900/30' :
            isSyncing ? 'bg-blue-100 dark:bg-blue-900/30' :
            syncStatus === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
            'bg-gray-100 dark:bg-gray-700/50'
          }`}>
            <SyncStatusIcon className={`w-4 h-4 ${
              !isOnline ? 'text-red-600 dark:text-red-400' :
              isSyncing ? 'text-blue-600 dark:text-blue-400' :
              syncStatus === 'success' ? 'text-green-600 dark:text-green-400' :
              'text-gray-600 dark:text-gray-400'
            }`} />
          </div>
          <div>
            <div className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">
              {!isOnline ? 'Офлайн' : isSyncing ? 'Синхронизация' : 'Онлайн'}
            </div>
            <div className={`text-xs ${getSyncStatusColor()}`}>
              {getSyncStatusText()}
            </div>
          </div>
        </div>

        {isOnline && (
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600 dark:text-green-400">
              Подключение к интернету активно
            </span>
          </div>
        )}
      </motion.div>

      {/* Кнопки управления */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.button
          onClick={handleSync}
          disabled={!isOnline || isSyncing}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
            !isOnline || isSyncing
              ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 cursor-not-allowed'
              : 'bg-white/60 dark:bg-gray-800/60 border-cyan-200 dark:border-cyan-700/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/30'
          }`}
          whileHover={!isOnline || isSyncing ? {} : { scale: 1.02, y: -2 }}
          whileTap={!isOnline || isSyncing ? {} : { scale: 0.98 }}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            !isOnline || isSyncing
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            <Cloud className={`w-5 h-5 ${
              !isOnline || isSyncing
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-cyan-600 dark:text-cyan-400'
            }`} />
          </div>
          <div className="text-left">
            <div className={`text-sm font-semibold ${
              !isOnline || isSyncing
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-cyan-800 dark:text-cyan-300'
            }`}>
              Синхронизировать
            </div>
            <div className={`text-xs ${
              !isOnline || isSyncing
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-cyan-600 dark:text-cyan-400'
            }`}>
              Загрузить и скачать
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={handleUpload}
          disabled={!isOnline || isSyncing}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
            !isOnline || isSyncing
              ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 cursor-not-allowed'
              : 'bg-white/60 dark:bg-gray-800/60 border-cyan-200 dark:border-cyan-700/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/30'
          }`}
          whileHover={!isOnline || isSyncing ? {} : { scale: 1.02, y: -2 }}
          whileTap={!isOnline || isSyncing ? {} : { scale: 0.98 }}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            !isOnline || isSyncing
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            <Upload className={`w-5 h-5 ${
              !isOnline || isSyncing
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-cyan-600 dark:text-cyan-400'
            }`} />
          </div>
          <div className="text-left">
            <div className={`text-sm font-semibold ${
              !isOnline || isSyncing
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-cyan-800 dark:text-cyan-300'
            }`}>
              Загрузить
            </div>
            <div className={`text-xs ${
              !isOnline || isSyncing
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-cyan-600 dark:text-cyan-400'
            }`}>
              Отправить в облако
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={handleDownload}
          disabled={!isOnline || isSyncing}
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
            !isOnline || isSyncing
              ? 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 cursor-not-allowed'
              : 'bg-white/60 dark:bg-gray-800/60 border-cyan-200 dark:border-cyan-700/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/30'
          }`}
          whileHover={!isOnline || isSyncing ? {} : { scale: 1.02, y: -2 }}
          whileTap={!isOnline || isSyncing ? {} : { scale: 0.98 }}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            !isOnline || isSyncing
              ? 'bg-gray-200 dark:bg-gray-700'
              : 'bg-cyan-100 dark:bg-cyan-900/30'
          }`}>
            <Download className={`w-5 h-5 ${
              !isOnline || isSyncing
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-cyan-600 dark:text-cyan-400'
            }`} />
          </div>
          <div className="text-left">
            <div className={`text-sm font-semibold ${
              !isOnline || isSyncing
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-cyan-800 dark:text-cyan-300'
            }`}>
              Скачать
            </div>
            <div className={`text-xs ${
              !isOnline || isSyncing
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-cyan-600 dark:text-cyan-400'
            }`}>
              Получить из облака
            </div>
          </div>
        </motion.button>
      </div>

      {/* Информация о синхронизации */}
      <motion.div
        className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl p-4 border border-cyan-300 dark:border-cyan-600/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">
            Преимущества облачной синхронизации
          </span>
        </div>
        <ul className="text-xs text-cyan-700 dark:text-cyan-400 space-y-1">
          <li>• Данные доступны на всех ваших устройствах</li>
          <li>• Автоматическое резервное копирование</li>
          <li>• Безопасное хранение в зашифрованном виде</li>
          <li>• Синхронизация в реальном времени</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}
