import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAchievements } from '../store/achievements.store';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';
import { Trophy, Star, Crown, Gem } from 'lucide-react';

const rarityColors = {
  common: 'text-gray-600 bg-gray-100',
  rare: 'text-blue-600 bg-blue-100',
  epic: 'text-purple-600 bg-purple-100',
  legendary: 'text-yellow-600 bg-yellow-100',
};

const rarityIcons = {
  common: Star,
  rare: Trophy,
  epic: Crown,
  legendary: Gem,
};

export function Achievements() {
  const { achievements, load, checkAchievements, getUnlockedAchievements } = useAchievements();
  const { tips, load: loadTips } = useTips();
  const { dailyTarget } = useSettings();

  useEffect(() => {
    console.log('🏆 Loading achievements...');
    load();
    loadTips();
  }, []);

  useEffect(() => {
    if (tips.length > 0 && dailyTarget) {
      console.log('🏆 Checking achievements for tips:', tips.length, 'dailyTarget:', dailyTarget);
      checkAchievements(tips, dailyTarget);
    }
  }, [tips, dailyTarget]);

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = achievements.filter(a => a.progress < a.maxProgress);
  
  console.log('🏆 Achievements state:', { 
    total: achievements.length, 
    unlocked: unlockedAchievements.length, 
    locked: lockedAchievements.length 
  });

  return (
    <motion.div 
      className="p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink mb-2">🏆 Достижения</h2>
        <p className="text-muted">
          Разблокировано: {unlockedAchievements.length} из {achievements.length + lockedAchievements.length}
        </p>
      </div>

      {/* Разблокированные достижения */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Разблокированные
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {unlockedAchievements.map((achievement) => {
              const IconComponent = rarityIcons[achievement.rarity];
              return (
                <motion.div
                  key={achievement.id}
                  className={`rounded-2xl p-4 border-2 ${rarityColors[achievement.rarity]} shadow-lg`}
                  initial={{ scale: 0.8, opacity: 0, y: 20, rotateX: -15 }}
                  animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="text-3xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                        damping: 10
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 10,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{achievement.title}</h4>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <p className="text-sm opacity-80">{achievement.description}</p>
                      <div className="text-xs mt-1 opacity-60">
                        {new Date(achievement.unlockedAt).toLocaleDateString('ru')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Заблокированные достижения */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ink mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gray-500" />
            В процессе
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {lockedAchievements.map((achievement) => {
              const IconComponent = rarityIcons[achievement.rarity];
              const progress = Math.round((achievement.progress / achievement.maxProgress) * 100);
              
              return (
                <motion.div
                  key={achievement.id}
                  className="rounded-2xl p-4 bg-card border border-mint/20 shadow-sm opacity-75"
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 0.75, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 120,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    opacity: 0.9,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg text-muted">{achievement.title}</h4>
                        <IconComponent className="w-4 h-4 text-muted" />
                      </div>
                      <p className="text-sm text-muted mb-2">{achievement.description}</p>
                      
                      {/* Прогресс бар */}
                      <div className="w-full bg-mint/20 rounded-full h-2 mb-2">
                        <motion.div
                          className="bg-mint h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                      
                      <div className="text-xs text-muted">
                        {achievement.progress} / {achievement.maxProgress} ({progress}%)
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Если нет достижений */}
      {achievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-ink mb-2">Начните зарабатывать чаевые!</h3>
          <p className="text-muted mb-4">Добавляйте чаевые, чтобы разблокировать достижения</p>
          <motion.button
            onClick={() => {
              console.log('🏆 Force checking achievements...');
              checkAchievements(tips, dailyTarget);
            }}
            className="px-6 py-3 bg-mint text-white rounded-xl font-semibold hover:bg-mint-soft transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Инициализировать достижения
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
