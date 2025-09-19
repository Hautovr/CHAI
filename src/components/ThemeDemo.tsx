import { motion } from 'framer-motion';
import { useThemes } from '../store/themes.store';

export function ThemeDemo() {
  const { getCurrentTheme } = useThemes();
  const currentTheme = getCurrentTheme();

  if (!currentTheme) return null;

  return (
    <motion.div
      className="bg-card rounded-xl p-4 border shadow-sm mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-ink mb-3">
        🎨 Демонстрация темы: {currentTheme.name}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Основные цвета */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Основной цвет</div>
          <div 
            className="h-8 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            {currentTheme.colors.primary}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Вторичный цвет</div>
          <div 
            className="h-8 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: currentTheme.colors.secondary }}
          >
            {currentTheme.colors.secondary}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Акцентный цвет</div>
          <div 
            className="h-8 rounded-lg flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: currentTheme.colors.accent }}
          >
            {currentTheme.colors.accent}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Фон</div>
          <div 
            className="h-8 rounded-lg flex items-center justify-center font-semibold border"
            style={{ 
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text,
              borderColor: currentTheme.colors.border
            }}
          >
            {currentTheme.colors.background}
          </div>
        </div>
      </div>

      {/* Примеры элементов */}
      <div className="mt-4 space-y-3">
        <div className="text-sm font-medium text-ink">Примеры элементов:</div>
        
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            Основная кнопка
          </button>
          <button 
            className="px-4 py-2 rounded-lg font-semibold border-2"
            style={{ 
              color: currentTheme.colors.secondary,
              borderColor: currentTheme.colors.secondary,
              backgroundColor: 'transparent'
            }}
          >
            Вторичная кнопка
          </button>
        </div>

        <div 
          className="p-3 rounded-lg border"
          style={{ 
            backgroundColor: currentTheme.colors.card,
            borderColor: currentTheme.colors.border
          }}
        >
          <div 
            className="text-sm font-medium mb-1"
            style={{ color: currentTheme.colors.text }}
          >
            Пример карточки
          </div>
          <div 
            className="text-xs"
            style={{ color: currentTheme.colors.text, opacity: 0.7 }}
          >
            Этот текст использует цвета текущей темы
          </div>
        </div>
      </div>
    </motion.div>
  );
}
