import { motion } from 'framer-motion';
import { Download, FileText, Database, Cloud, Calendar, BarChart3 } from 'lucide-react';
import { useTips } from '../store/tips.store';
import { useShifts } from '../store/shifts.store';
import { useSubscription } from '../store/subscription.store';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export function DataExport() {
  const { tips } = useTips();
  const { shifts } = useShifts();
  const { hasFeature } = useSubscription();

  if (!hasFeature('export_data')) {
    return null;
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Дата', 'Время', 'Сумма (₽)', 'Метод оплаты', 'Смена', 'Комментарий'],
      ...tips.map(tip => [
        format(new Date(tip.createdAt), 'dd.MM.yyyy', { locale: ru }),
        format(new Date(tip.createdAt), 'HH:mm', { locale: ru }),
        tip.amount.toString(),
        tip.method || 'Наличные',
        tip.shiftId || 'Не указана',
        tip.note || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `chai-schitai-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Простая реализация PDF экспорта
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
    const totalShifts = shifts.length;
    const averagePerShift = totalShifts > 0 ? totalTips / totalShifts : 0;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Отчет ЧайСчитай</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .tips-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .tips-table th, .tips-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .tips-table th { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🍵 ЧайСчитай - Отчет</h1>
          <p>Сгенерировано: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: ru })}</p>
        </div>
        
        <div class="stats">
          <div class="stat">
            <h3>${totalTips.toLocaleString()} ₽</h3>
            <p>Общая сумма чаевых</p>
          </div>
          <div class="stat">
            <h3>${tips.length}</h3>
            <p>Количество записей</p>
          </div>
          <div class="stat">
            <h3>${totalShifts}</h3>
            <p>Количество смен</p>
          </div>
          <div class="stat">
            <h3>${Math.round(averagePerShift).toLocaleString()} ₽</h3>
            <p>Среднее за смену</p>
          </div>
        </div>

        <table class="tips-table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Время</th>
              <th>Сумма</th>
              <th>Метод оплаты</th>
              <th>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            ${tips.map(tip => `
              <tr>
                <td>${format(new Date(tip.createdAt), 'dd.MM.yyyy', { locale: ru })}</td>
                <td>${format(new Date(tip.createdAt), 'HH:mm', { locale: ru })}</td>
                <td>${tip.amount.toLocaleString()} ₽</td>
                <td>${tip.method || 'Наличные'}</td>
                <td>${tip.note || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Создано с помощью ЧайСчитай - приложения для отслеживания чаевых</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const createBackup = () => {
    const backupData = {
      tips,
      shifts,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `chai-schitai-backup-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-700/50 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
            📊 Экспорт данных
          </h2>
          <p className="text-sm text-green-600 dark:text-green-400">
            CSV, PDF отчеты и резервное копирование
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          onClick={exportToCSV}
          className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-green-200 dark:border-green-700/50 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-green-800 dark:text-green-300">CSV файл</h3>
              <p className="text-xs text-green-600 dark:text-green-400">Excel, Google Sheets</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Все данные в табличном формате для анализа
          </div>
        </motion.button>

        <motion.button
          onClick={exportToPDF}
          className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-green-200 dark:border-green-700/50 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-green-800 dark:text-green-300">PDF отчет</h3>
              <p className="text-xs text-green-600 dark:text-green-400">Красивый отчет</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Готовый отчет с графиками и статистикой
          </div>
        </motion.button>

        <motion.button
          onClick={createBackup}
          className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-green-200 dark:border-green-700/50 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
              <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-green-800 dark:text-green-300">Резервная копия</h3>
              <p className="text-xs text-green-600 dark:text-green-400">JSON формат</p>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Полная копия всех данных для восстановления
          </div>
        </motion.button>
      </div>

      <motion.div
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Статистика экспорта
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Записей чаевых:</span>
            <span className="ml-2 font-semibold text-blue-800 dark:text-blue-300">{tips.length}</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Смен:</span>
            <span className="ml-2 font-semibold text-blue-800 dark:text-blue-300">{shifts.length}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
