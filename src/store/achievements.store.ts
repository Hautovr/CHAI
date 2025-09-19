import { create } from 'zustand';
import { db } from '../db/dexie';
import { Achievement, Streak } from '../db/models';
import { v4 as uuid } from 'uuid';
import { format, startOfDay, isSameDay, addDays, subDays } from 'date-fns';

type AchievementsState = {
  achievements: Achievement[];
  streaks: Streak[];
  load: () => Promise<void>;
  checkAchievements: (tips: any[], dailyTarget: number) => Promise<void>;
  getUnlockedAchievements: () => Achievement[];
  getStreak: (type: 'daily_target') => Streak | undefined;
  updateStreak: (type: 'daily_target', achieved: boolean) => Promise<void>;
  resetAchievements: () => Promise<void>;
};

// Предопределенные достижения
const ACHIEVEMENT_DEFINITIONS = [
  // Дневные цели
  { id: 'first_target', type: 'daily_target', title: 'Первая цель', description: 'Достигните дневной цели впервые', icon: '🎯', maxProgress: 1, rarity: 'common' },
  { id: 'target_3_days', type: 'daily_target', title: 'Три дня подряд', description: 'Достигайте цели 3 дня подряд', icon: '🔥', maxProgress: 3, rarity: 'rare' },
  { id: 'target_7_days', type: 'daily_target', title: 'Неделя успеха', description: 'Достигайте цели 7 дней подряд', icon: '💪', maxProgress: 7, rarity: 'epic' },
  { id: 'target_30_days', type: 'daily_target', title: 'Месяц мастерства', description: 'Достигайте цели 30 дней подряд', icon: '👑', maxProgress: 30, rarity: 'legendary' },
  
  // Общие суммы
  { id: 'first_1000', type: 'total_amount', title: 'Первая тысяча', description: 'Заработайте 1000₽ чаевых', icon: '💰', maxProgress: 1000, rarity: 'common' },
  { id: 'first_10000', type: 'total_amount', title: 'Десять тысяч', description: 'Заработайте 10000₽ чаевых', icon: '💎', maxProgress: 10000, rarity: 'rare' },
  { id: 'first_50000', type: 'total_amount', title: 'Пятьдесят тысяч', description: 'Заработайте 50000₽ чаевых', icon: '🏆', maxProgress: 50000, rarity: 'epic' },
  { id: 'first_100000', type: 'total_amount', title: 'Сотня тысяч', description: 'Заработайте 100000₽ чаевых', icon: '💸', maxProgress: 100000, rarity: 'legendary' },
  
  // Большие чаевые
  { id: 'big_tip_500', type: 'big_tip', title: 'Щедрый клиент', description: 'Получите чаевые 500₽ или больше', icon: '🎁', maxProgress: 1, rarity: 'rare' },
  { id: 'big_tip_1000', type: 'big_tip', title: 'Очень щедрый', description: 'Получите чаевые 1000₽ или больше', icon: '💝', maxProgress: 1, rarity: 'epic' },
  { id: 'big_tip_2000', type: 'big_tip', title: 'Невероятно щедрый', description: 'Получите чаевые 2000₽ или больше', icon: '🎊', maxProgress: 1, rarity: 'legendary' },
  
  // Консистентность
  { id: 'consistency_7', type: 'consistency', title: 'Стабильность', description: 'Добавляйте чаевые 7 дней подряд', icon: '📈', maxProgress: 7, rarity: 'rare' },
  { id: 'consistency_30', type: 'consistency', title: 'Привычка', description: 'Добавляйте чаевые 30 дней подряд', icon: '📊', maxProgress: 30, rarity: 'epic' },
];

export const useAchievements = create<AchievementsState>((set, get) => ({
  achievements: [],
  streaks: [],
  
  async load() {
    const achievements = await db.achievements.orderBy('unlockedAt').reverse().toArray();
    const streaks = await db.streaks.toArray();
    set({ achievements, streaks });
  },
  
  getUnlockedAchievements() {
    return get().achievements.filter(a => a.progress >= a.maxProgress);
  },
  
  getStreak(type) {
    return get().streaks.find(s => s.type === type);
  },
  
  async updateStreak(type, achieved) {
    const { streaks } = get();
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    let streak = streaks.find(s => s.type === type);
    
    if (!streak) {
      streak = {
        id: uuid(),
        type,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }
    
    if (achieved) {
      // Проверяем, не пропустили ли день
      if (streak.lastAchievedDate) {
        const lastDate = new Date(streak.lastAchievedDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Продолжаем стрек
          streak.currentStreak += 1;
        } else if (daysDiff > 1) {
          // Сброс стрека
          streak.currentStreak = 1;
        }
        // Если daysDiff === 0, то уже считали за сегодня
      } else {
        // Первый день
        streak.currentStreak = 1;
      }
      
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      streak.lastAchievedDate = today;
    }
    
    streak.updatedAt = Date.now();
    await db.streaks.put(streak);
    
    set(state => ({
      streaks: state.streaks.filter(s => s.type !== type).concat(streak!)
    }));
  },
  
  async checkAchievements(tips, dailyTarget) {
    const { achievements } = get();
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const todayTips = tips.filter(tip => isSameDay(new Date(tip.createdAt), new Date()));
    const todayTotal = todayTips.reduce((sum, tip) => sum + tip.amount, 0);
    const totalAmount = tips.reduce((sum, tip) => sum + tip.amount, 0);
    
    // Проверяем достижение дневной цели
    if (todayTotal >= dailyTarget) {
      await get().updateStreak('daily_target', true);
    }
    
    // Проверяем все достижения
    for (const def of ACHIEVEMENT_DEFINITIONS) {
      let existingAchievement = achievements.find(a => a.id === def.id);
      let progress = 0;
      let shouldUpdate = false;
      
      // Если достижения нет в БД, создаем его
      if (!existingAchievement) {
        existingAchievement = {
          id: def.id,
          type: def.type as any,
          title: def.title,
          description: def.description,
          icon: def.icon,
          unlockedAt: 0,
          progress: 0,
          maxProgress: def.maxProgress,
          rarity: def.rarity as any,
        };
        await db.achievements.put(existingAchievement);
        set(state => ({
          achievements: [...state.achievements, existingAchievement!]
        }));
      }
      
      switch (def.type) {
        case 'daily_target':
          if (todayTotal >= dailyTarget) {
            progress = Math.min(def.maxProgress, (existingAchievement?.progress || 0) + 1);
            shouldUpdate = true;
          }
          break;
          
        case 'total_amount':
          progress = Math.min(def.maxProgress, totalAmount);
          shouldUpdate = progress > (existingAchievement?.progress || 0);
          break;
          
        case 'big_tip':
          const hasBigTip = tips.some(tip => tip.amount >= def.maxProgress);
          if (hasBigTip) {
            progress = def.maxProgress;
            shouldUpdate = !existingAchievement;
          }
          break;
          
        case 'consistency':
          // Считаем дни подряд с чаевыми
          const daysWithTips = new Set();
          tips.forEach(tip => {
            daysWithTips.add(format(startOfDay(new Date(tip.createdAt)), 'yyyy-MM-dd'));
          });
          
          let consecutiveDays = 0;
          const sortedDays = Array.from(daysWithTips).sort().reverse() as string[];
          for (let i = 0; i < sortedDays.length; i++) {
            if (i === 0 || 
                Math.floor((new Date(sortedDays[i-1]).getTime() - new Date(sortedDays[i]).getTime()) / (1000 * 60 * 60 * 24)) === 1) {
              consecutiveDays++;
            } else {
              break;
            }
          }
          
          progress = Math.min(def.maxProgress, consecutiveDays);
          shouldUpdate = progress > (existingAchievement?.progress || 0);
          break;
      }
      
      if (shouldUpdate) {
        existingAchievement.progress = progress;
        if (progress >= def.maxProgress && existingAchievement.unlockedAt === 0) {
          existingAchievement.unlockedAt = Date.now();
        }
        await db.achievements.put(existingAchievement);
        
        set(state => ({
          achievements: state.achievements.filter(a => a.id !== def.id).concat(existingAchievement!)
        }));
      }
    }
  },

  resetAchievements: async () => {
    // Очищаем все достижения из базы данных
    await db.achievements.clear();
    await db.streaks.clear();
    
    // Сбрасываем состояние
    set({ achievements: [], streaks: [] });
    
    console.log('🗑️ Все достижения сброшены');
  }
}));
