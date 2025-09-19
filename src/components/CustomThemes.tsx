import { motion } from 'framer-motion';
import { Palette, Sun, Moon, Sparkles, Heart, Star, Zap, Crown, Edit, Trash2 } from 'lucide-react';
import { useSubscription } from '../store/subscription.store';
import { useThemes } from '../store/themes.store';
import { useState } from 'react';
import { ThemeCreator } from './ThemeCreator';

export function CustomThemes() {
  const { hasFeature } = useSubscription();
  const { 
    themes, 
    currentThemeId, 
    setCurrentTheme, 
    deleteCustomTheme 
  } = useThemes();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);

  if (!hasFeature('custom_themes')) {
    return null;
  }

  const getThemeIcon = (themeId: string) => {
    const iconMap: { [key: string]: any } = {
      'default': Sun,
      'dark': Moon,
      'sunset': Sun,
      'ocean': Sparkles,
      'forest': Heart,
      'royal': Crown,
      'neon': Zap,
      'golden': Star
    };
    return iconMap[themeId] || Palette;
  };

  const applyTheme = (themeId: string) => {
    console.log('🎨 Applying theme:', themeId);
    setCurrentTheme(themeId);
  };

  const handleEditTheme = (themeId: string) => {
    setEditingThemeId(themeId);
    setIsCreatorOpen(true);
  };

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('Удалить эту тему? Это действие нельзя отменить.')) {
      deleteCustomTheme(themeId);
    }
  };

  const handleCreateTheme = () => {
    setEditingThemeId(null);
    setIsCreatorOpen(true);
  };

  const handleCloseCreator = () => {
    setIsCreatorOpen(false);
    setEditingThemeId(null);
  };

  const defaultThemes = themes.filter(theme => !theme.isCustom);
  const customThemes = themes.filter(theme => theme.isCustom);

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-lg border border-pink-200 dark:border-pink-700/50 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-pink-800 dark:text-pink-300">
              🎨 Кастомные темы
            </h2>
            <p className="text-sm text-pink-600 dark:text-pink-400">
              Неограниченное количество цветовых схем
            </p>
          </div>
        </div>

        {/* Готовые темы */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-300 mb-4">
            Готовые темы
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {defaultThemes.map((theme, index) => {
              const IconComponent = getThemeIcon(theme.id);
              const isSelected = currentThemeId === theme.id;
              
              return (
                <motion.button
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                  className={`relative rounded-xl p-4 border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-pink-500 shadow-lg scale-105' 
                      : 'border-pink-200 dark:border-pink-700/50 hover:border-pink-300 dark:hover:border-pink-600/50'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div 
                    className="w-full h-16 rounded-lg mb-3 relative overflow-hidden"
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <div 
                      className="absolute top-2 left-2 w-6 h-6 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="absolute top-2 right-2 w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-lg flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-pink-500" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <IconComponent className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      <span className="text-sm font-semibold text-pink-800 dark:text-pink-300">
                        {theme.name}
                      </span>
                    </div>
                    <p className="text-xs text-pink-600 dark:text-pink-400">
                      {theme.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Пользовательские темы */}
        {customThemes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-pink-800 dark:text-pink-300 mb-4">
              Мои темы
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {customThemes.map((theme, index) => {
                const IconComponent = Palette;
                const isSelected = currentThemeId === theme.id;
                
                return (
                  <motion.div
                    key={theme.id}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <motion.button
                      onClick={() => applyTheme(theme.id)}
                      className={`w-full rounded-xl p-4 border-2 transition-all duration-300 ${
                        isSelected 
                          ? 'border-pink-500 shadow-lg scale-105' 
                          : 'border-pink-200 dark:border-pink-700/50 hover:border-pink-300 dark:hover:border-pink-600/50'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div 
                        className="w-full h-16 rounded-lg mb-3 relative overflow-hidden"
                        style={{ backgroundColor: theme.colors.background }}
                      >
                        <div 
                          className="absolute top-2 left-2 w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div 
                          className="absolute top-2 right-2 w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div 
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 rounded-full"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0 bg-white/20 rounded-lg flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-pink-500" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <IconComponent className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          <span className="text-sm font-semibold text-pink-800 dark:text-pink-300">
                            {theme.name}
                          </span>
                        </div>
                        <p className="text-xs text-pink-600 dark:text-pink-400">
                          {theme.description}
                        </p>
                      </div>
                    </motion.button>

                    {/* Кнопки управления */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTheme(theme.id);
                          }}
                          className="w-6 h-6 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTheme(theme.id);
                          }}
                          className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Создать свою тему */}
        <motion.div
          className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-pink-300 dark:border-pink-600/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span className="text-sm font-semibold text-pink-800 dark:text-pink-300">
              Создать свою тему
            </span>
          </div>
          <p className="text-xs text-pink-700 dark:text-pink-400 mb-3">
            Хотите создать уникальную тему? Настройте цвета под свой вкус!
          </p>
          <motion.button
            onClick={handleCreateTheme}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            Создать тему
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <p className="text-xs text-pink-600 dark:text-pink-400">
            ✨ Тема применяется мгновенно и сохраняется автоматически
          </p>
        </motion.div>
      </motion.div>

      {/* Создатель тем */}
      <ThemeCreator
        isOpen={isCreatorOpen}
        onClose={handleCloseCreator}
        editingThemeId={editingThemeId}
      />
    </>
  );
}