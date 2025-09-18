import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, BarChart3, Trash2 } from 'lucide-react';
import { telegram } from '../lib/telegram';
import { format, startOfDay, addDays, subDays } from 'date-fns';

interface TablesStatsProps {
  onAddTable: () => void;
}

export function TablesStats({ onAddTable }: TablesStatsProps) {
  const [todayTables, setTodayTables] = useState(0);
  const [yesterdayTables, setYesterdayTables] = useState(0);

  // Загружаем статистику столов из localStorage
  useEffect(() => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const yesterday = format(startOfDay(subDays(new Date(), 1)), 'yyyy-MM-dd');
    
    const savedToday = localStorage.getItem(`tables_${today}`);
    const savedYesterday = localStorage.getItem(`tables_${yesterday}`);
    
    if (savedToday) setTodayTables(parseInt(savedToday));
    if (savedYesterday) setYesterdayTables(parseInt(savedYesterday));
  }, []);

  const addTable = () => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const newToday = todayTables + 1;
    
    setTodayTables(newToday);
    localStorage.setItem(`tables_${today}`, newToday.toString());
    
    telegram.hapticLight();
    onAddTable();
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
    <div className="bg-card rounded-xl p-3 shadow-sm border border-mint/20 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-mint flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-ink">Столы</span>
        </div>
        
        <div className="flex gap-1">
          <motion.button
            onClick={removeTable}
            disabled={todayTables === 0}
            className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center transition-all ${
              todayTables === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
            }`}
            whileHover={{ scale: todayTables > 0 ? 1.1 : 1 }}
            whileTap={{ scale: todayTables > 0 ? 0.9 : 1 }}
          >
            -1
          </motion.button>

          <motion.button
            onClick={addTable}
            className="w-6 h-6 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +1
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-mint/10 rounded-lg p-2">
          <div className="text-xs text-muted mb-1">Вчера</div>
          <div className="text-lg font-bold text-mint">{yesterdayTables}</div>
        </div>
        <div className="bg-mint/20 rounded-lg p-2 border-2 border-mint">
          <div className="text-xs text-muted mb-1">Сегодня</div>
          <div className="text-lg font-bold text-mint">{todayTables}</div>
        </div>
      </div>
    </div>
  );
}
