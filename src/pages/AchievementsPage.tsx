import { useState } from 'react';
import { motion } from 'framer-motion';
import { Achievements } from '../components/Achievements';
import { Streaks } from '../components/Streaks';
import { Trophy, Flame } from 'lucide-react';

type Tab = 'achievements' | 'streaks';

export function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('achievements');

  return (
    <div className="h-full flex flex-col">
      {/* Табы */}
      <div className="flex bg-card border-b border-mint/20">
        <motion.button
          className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${
            activeTab === 'achievements' 
              ? 'text-mint border-b-2 border-mint' 
              : 'text-muted hover:text-ink'
          }`}
          onClick={() => setActiveTab('achievements')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy className="w-5 h-5" />
          Достижения
        </motion.button>
        
        <motion.button
          className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${
            activeTab === 'streaks' 
              ? 'text-mint border-b-2 border-mint' 
              : 'text-muted hover:text-ink'
          }`}
          onClick={() => setActiveTab('streaks')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Flame className="w-5 h-5" />
          Стреки
        </motion.button>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'achievements' && <Achievements />}
          {activeTab === 'streaks' && <Streaks />}
        </motion.div>
      </div>
    </div>
  );
}
