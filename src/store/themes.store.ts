import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  isCustom: boolean;
  createdAt?: Date;
}

export interface ThemesState {
  themes: Theme[];
  currentThemeId: string;
  setCurrentTheme: (themeId: string) => void;
  createCustomTheme: (theme: Omit<Theme, 'id' | 'isCustom' | 'createdAt'>) => string;
  updateCustomTheme: (themeId: string, updates: Partial<Theme>) => void;
  deleteCustomTheme: (themeId: string) => void;
  getCurrentTheme: () => Theme | undefined;
  resetThemes: () => void;
  getThemeById: (themeId: string) => Theme | undefined;
}

const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Классический',
    description: 'Стандартная тема приложения',
    isCustom: false,
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#F8FAFC',
      text: '#1F2937',
      card: '#FFFFFF',
      border: '#E5E7EB'
    }
  },
  {
    id: 'dark',
    name: 'Темная',
    description: 'Элегантная темная тема',
    isCustom: false,
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#8B5CF6',
      background: '#F8FAFC',
      text: '#1F2937',
      card: '#FFFFFF',
      border: '#E5E7EB'
    }
  },
  {
    id: 'sunset',
    name: 'Закат',
    description: 'Теплые оранжевые тона',
    isCustom: false,
    colors: {
      primary: '#F97316',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FEF3F2',
      text: '#7C2D12',
      card: '#FFFFFF',
      border: '#FED7AA'
    }
  },
  {
    id: 'ocean',
    name: 'Океан',
    description: 'Прохладные синие оттенки',
    isCustom: false,
    colors: {
      primary: '#06B6D4',
      secondary: '#14B8A6',
      accent: '#3B82F6',
      background: '#F0FDFF',
      text: '#0C4A6E',
      card: '#FFFFFF',
      border: '#A5F3FC'
    }
  },
  {
    id: 'forest',
    name: 'Лес',
    description: 'Природные зеленые тона',
    isCustom: false,
    colors: {
      primary: '#059669',
      secondary: '#84CC16',
      accent: '#10B981',
      background: '#F0FDF4',
      text: '#14532D',
      card: '#FFFFFF',
      border: '#BBF7D0'
    }
  },
  {
    id: 'royal',
    name: 'Королевская',
    description: 'Роскошные фиолетовые тона',
    isCustom: false,
    colors: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#8B5CF6',
      background: '#FAF5FF',
      text: '#581C87',
      card: '#FFFFFF',
      border: '#DDD6FE'
    }
  },
  {
    id: 'neon',
    name: 'Неон',
    description: 'Яркие неоновые цвета',
    isCustom: false,
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      accent: '#10B981',
      background: '#F8FAFC',
      text: '#1F2937',
      card: '#FFFFFF',
      border: '#E5E7EB'
    }
  },
  {
    id: 'golden',
    name: 'Золотая',
    description: 'Роскошные золотые оттенки',
    isCustom: false,
    colors: {
      primary: '#F59E0B',
      secondary: '#F97316',
      accent: '#EAB308',
      background: '#FFFBEB',
      text: '#92400E',
      card: '#FFFFFF',
      border: '#FDE68A'
    }
  }
];

export const useThemes = create<ThemesState>()(
  persist(
    (set, get) => ({
      themes: defaultThemes,
      currentThemeId: 'default',

      setCurrentTheme: (themeId: string) => {
        console.log('🎨 setCurrentTheme called with:', themeId);
        const { themes } = get();
        const theme = themes.find(t => t.id === themeId);
        console.log('🎨 Found theme:', theme);
        if (theme) {
          set({ currentThemeId: themeId });
          applyThemeToDocument(theme);
          
          // Применяем тему повторно через небольшую задержку
          // для элементов, которые могли появиться после рендера
          setTimeout(() => {
            applyThemeToAllElements(theme);
          }, 100);
        } else {
          console.error('🎨 Theme not found:', themeId);
        }
      },

      createCustomTheme: (themeData) => {
        const { themes } = get();
        const newTheme: Theme = {
          ...themeData,
          id: `custom_${Date.now()}`,
          isCustom: true,
          createdAt: new Date()
        };
        
        set({ themes: [...themes, newTheme] });
        return newTheme.id;
      },

      updateCustomTheme: (themeId: string, updates: Partial<Theme>) => {
        const { themes } = get();
        const updatedThemes = themes.map(theme => 
          theme.id === themeId && theme.isCustom 
            ? { ...theme, ...updates }
            : theme
        );
        set({ themes: updatedThemes });
      },

      deleteCustomTheme: (themeId: string) => {
        const { themes, currentThemeId } = get();
        const updatedThemes = themes.filter(theme => theme.id !== themeId);
        
        // Если удаляем текущую тему, переключаемся на дефолтную
        const newCurrentThemeId = currentThemeId === themeId ? 'default' : currentThemeId;
        
        set({ 
          themes: updatedThemes,
          currentThemeId: newCurrentThemeId
        });
      },

      getCurrentTheme: () => {
        const { themes, currentThemeId } = get();
        console.log('🎨 getCurrentTheme called, currentThemeId:', currentThemeId);
        console.log('🎨 Available themes:', themes.map(t => t.id));
        const theme = themes.find(theme => theme.id === currentThemeId);
        console.log('🎨 getCurrentTheme returning:', theme);
        return theme;
      },

      getThemeById: (themeId: string) => {
        const { themes } = get();
        return themes.find(theme => theme.id === themeId);
      },

      resetThemes: () => {
        set({ 
          themes: defaultThemes,
          currentThemeId: 'default'
        });
      }
    }),
    {
      name: 'themes-storage',
    }
  )
);

// Функция для применения темы к документу
function applyThemeToDocument(theme: Theme) {
  console.log('🎨 applyThemeToDocument called with:', theme);
  
  const root = document.documentElement;
  
  // Применяем CSS переменные
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-card', theme.colors.card);
  root.style.setProperty('--theme-border', theme.colors.border);
  
  // Добавляем класс темы к body
  document.body.className = document.body.className.replace(/theme-\w+/g, '');
  document.body.classList.add(`theme-${theme.id}`);
  
  // Принудительно применяем стили ко всем элементам
  applyThemeToAllElements(theme);
  
  console.log('🎨 Theme applied:', theme.name, theme.colors);
  console.log('🎨 CSS variables set:', {
    primary: root.style.getPropertyValue('--theme-primary'),
    secondary: root.style.getPropertyValue('--theme-secondary'),
    accent: root.style.getPropertyValue('--theme-accent'),
    background: root.style.getPropertyValue('--theme-background'),
    text: root.style.getPropertyValue('--theme-text'),
    card: root.style.getPropertyValue('--theme-card'),
    border: root.style.getPropertyValue('--theme-border')
  });
}

// Функция для принудительного применения темы ко всем элементам
function applyThemeToAllElements(theme: Theme) {
  console.log('🎨 Applying theme to all elements:', theme.name);
  
  // Применяем к body
  document.body.style.backgroundColor = theme.colors.background;
  document.body.style.color = theme.colors.text;
  
  // Применяем к root элементу
  const root = document.getElementById('root');
  if (root) {
    root.style.backgroundColor = theme.colors.background;
    root.style.color = theme.colors.text;
  }
  
  // Применяем ко всем заголовкам
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    (heading as HTMLElement).style.color = theme.colors.text;
  });
  
  // Применяем ко всем параграфам и тексту
  const textElements = document.querySelectorAll('p, span, div, button, input, textarea, label');
  textElements.forEach(element => {
    (element as HTMLElement).style.color = theme.colors.text;
  });
  
  // Применяем к карточкам
  const cards = document.querySelectorAll('.bg-card, .bg-white');
  cards.forEach(card => {
    (card as HTMLElement).style.backgroundColor = theme.colors.card;
  });
  
  // Применяем к кнопкам с mint цветом
  const mintButtons = document.querySelectorAll('.bg-mint');
  mintButtons.forEach(button => {
    (button as HTMLElement).style.backgroundColor = theme.colors.primary;
  });
  
  // Применяем к тексту с mint цветом
  const mintText = document.querySelectorAll('.text-mint');
  mintText.forEach(element => {
    (element as HTMLElement).style.color = theme.colors.primary;
  });
  
  // Применяем к границам
  const borders = document.querySelectorAll('.border, .border-mint');
  borders.forEach(element => {
    (element as HTMLElement).style.borderColor = theme.colors.border;
  });
  
  // Применяем к элементам с классами text-ink
  const inkElements = document.querySelectorAll('.text-ink');
  inkElements.forEach(element => {
    (element as HTMLElement).style.color = theme.colors.text;
  });
  
  // Применяем к элементам с классами text-muted
  const mutedElements = document.querySelectorAll('.text-muted');
  mutedElements.forEach(element => {
    (element as HTMLElement).style.color = theme.colors.text;
    (element as HTMLElement).style.opacity = '0.7';
  });
  
  console.log('🎨 Applied theme to all elements');
}
