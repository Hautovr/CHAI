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

export function AchievementsCompact() {
  const { achievements, load, checkAchievements, getUnlockedAchievements } = useAchievements();
  const { tips, load: loadTips } = useTips();
  const { dailyTarget } = useSettings();

  useEffect(() => {
    load();
    loadTips();
  }, []);

  useEffect(() => {
    if (tips.length > 0 && dailyTarget) {
      checkAchievements(tips, dailyTarget);
    }
  }, [tips, dailyTarget]);

  const unlockedAchievements = getUnlockedAchievements();
  const recentAchievements = unlockedAchievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3);

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-mint/10 to-purple-100/10 rounded-2xl p-4 border border-mint/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-ink flex items-center gap-2">
          🏆 Достижения
        </h3>
        <div className="text-sm text-muted">
          {unlockedAchievements.length}/{achievements.length}
        </div>
      </div>

      {recentAchievements.length > 0 ? (
        <div className="space-y-2">
          {recentAchievements.map((achievement) => {
            const IconComponent = rarityIcons[achievement.rarity];
            return (
              <motion.div
                key={achievement.id}
                className={`rounded-xl p-3 border ${rarityColors[achievement.rarity]} shadow-sm`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-semibold text-sm truncate">{achievement.title}</h4>
                      <IconComponent className="w-3 h-3 flex-shrink-0" />
                    </div>
                    <p className="text-xs opacity-80 truncate">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {unlockedAchievements.length > 3 && (
            <div className="text-center">
              <div className="text-xs text-muted">
                +{unlockedAchievements.length - 3} еще
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-sm text-muted">Добавляйте чаевые для разблокировки достижений</p>
        </div>
      )}
    </div>
  );
}
