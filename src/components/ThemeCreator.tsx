import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Save, X, RotateCcw, Eye, Download, Upload } from 'lucide-react';
import { useThemes } from '../store/themes.store';
import { useSubscription } from '../store/subscription.store';
import { useState, useEffect } from 'react';

interface ThemeCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  editingThemeId?: string;
}

export function ThemeCreator({ isOpen, onClose, editingThemeId }: ThemeCreatorProps) {
  const { 
    themes, 
    createCustomTheme, 
    updateCustomTheme, 
    getThemeById,
    setCurrentTheme 
  } = useThemes();
  const { hasFeature } = useSubscription();
  
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: '#F8FAFC',
    text: '#1F2937',
    card: '#FFFFFF',
    border: '#E5E7EB'
  });
  const [previewMode, setPreviewMode] = useState(false);

  const isEditing = !!editingThemeId;
  const editingTheme = editingThemeId ? getThemeById(editingThemeId) : null;

  useEffect(() => {
    if (isEditing && editingTheme) {
      setThemeName(editingTheme.name);
      setThemeDescription(editingTheme.description);
      setColors(editingTheme.colors);
    } else {
      setThemeName('');
      setThemeDescription('');
      setColors({
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#8B5CF6',
        background: '#F8FAFC',
        text: '#1F2937',
        card: '#FFFFFF',
        border: '#E5E7EB'
      });
    }
  }, [isEditing, editingTheme]);

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
  };

  const handleSave = () => {
    if (!themeName.trim()) return;

    const themeData = {
      name: themeName.trim(),
      description: themeDescription.trim() || 'Пользовательская тема',
      colors
    };

    if (isEditing && editingThemeId) {
      updateCustomTheme(editingThemeId, themeData);
    } else {
      const newThemeId = createCustomTheme(themeData);
      setCurrentTheme(newThemeId);
    }

    onClose();
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      // Применяем превью темы
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', colors.primary);
      root.style.setProperty('--theme-secondary', colors.secondary);
      root.style.setProperty('--theme-accent', colors.accent);
      root.style.setProperty('--theme-background', colors.background);
      root.style.setProperty('--theme-text', colors.text);
      root.style.setProperty('--theme-card', colors.card);
      root.style.setProperty('--theme-border', colors.border);
    } else {
      // Возвращаем текущую тему
      const currentTheme = themes.find(t => t.id === useThemes.getState().currentThemeId);
      if (currentTheme) {
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', currentTheme.colors.primary);
        root.style.setProperty('--theme-secondary', currentTheme.colors.secondary);
        root.style.setProperty('--theme-accent', currentTheme.colors.accent);
        root.style.setProperty('--theme-background', currentTheme.colors.background);
        root.style.setProperty('--theme-text', currentTheme.colors.text);
        root.style.setProperty('--theme-card', currentTheme.colors.card);
        root.style.setProperty('--theme-border', currentTheme.colors.border);
      }
    }
  };

  const handleReset = () => {
    setColors({
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#F8FAFC',
      text: '#1F2937',
      card: '#FFFFFF',
      border: '#E5E7EB'
    });
  };

  const colorInputs = [
    { key: 'primary', label: 'Основной цвет', description: 'Кнопки, ссылки, акценты' },
    { key: 'secondary', label: 'Вторичный цвет', description: 'Дополнительные элементы' },
    { key: 'accent', label: 'Акцентный цвет', description: 'Выделения, прогресс-бары' },
    { key: 'background', label: 'Фон', description: 'Основной фон приложения' },
    { key: 'text', label: 'Текст', description: 'Основной цвет текста' },
    { key: 'card', label: 'Карточки', description: 'Фон карточек и блоков' },
    { key: 'border', label: 'Границы', description: 'Границы элементов' }
  ] as const;

  if (!hasFeature('custom_themes')) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {isEditing ? 'Редактировать тему' : 'Создать тему'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Настройте цвета под свой вкус
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Информация о теме */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Название темы
                </label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Введите название темы"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Описание
                </label>
                <input
                  type="text"
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                  placeholder="Краткое описание темы"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Настройки цветов */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Цветовая палитра
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {colorInputs.map(({ key, label, description }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                        style={{ backgroundColor: colors[key] }}
                        onClick={() => {
                          const input = document.getElementById(`color-${key}`) as HTMLInputElement;
                          input?.click();
                        }}
                        title={`Выбрать цвет для ${label}`}
                        aria-label={`Выбрать цвет для ${label}`}
                      />
                      <input
                        id={`color-${key}`}
                        type="color"
                        value={colors[key]}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-0 h-0 opacity-0"
                        title={`Цветовой пикер для ${label}`}
                        aria-label={`Цветовой пикер для ${label}`}
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={colors[key]}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                          placeholder={`Введите цвет для ${label}`}
                          title={`Текстовое поле для ввода цвета ${label}`}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Превью темы */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Превью темы
              </h3>
              <div 
                className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                style={{ 
                  backgroundColor: colors.card,
                  borderColor: colors.border
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div>
                    <div 
                      className="text-lg font-semibold"
                      style={{ color: colors.text }}
                    >
                      Пример карточки
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: colors.text, opacity: 0.7 }}
                    >
                      Это превью вашей темы
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Основная кнопка
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-semibold border-2"
                    style={{ 
                      color: colors.secondary,
                      borderColor: colors.secondary,
                      backgroundColor: 'transparent'
                    }}
                  >
                    Вторичная кнопка
                  </button>
                </div>
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <motion.button
                  onClick={handlePreview}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    previewMode
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                  {previewMode ? 'Отключить превью' : 'Превью'}
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Сбросить
                </motion.button>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  disabled={!themeName.trim()}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 ${
                    !themeName.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  }`}
                  whileHover={!themeName.trim() ? {} : { scale: 1.05 }}
                  whileTap={!themeName.trim() ? {} : { scale: 0.95 }}
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {isEditing ? 'Сохранить' : 'Создать'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
