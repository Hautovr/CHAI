import { Sun, Moon, Smartphone } from 'lucide-react';
import { useSettings } from '../store/settings.store';
import { telegram } from '../lib/telegram';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, save } = useSettings();

  const themes = [
    { value: 'auto', label: 'Авто', icon: Smartphone },
    { value: 'light', label: 'Светлая', icon: Sun },
    { value: 'dark', label: 'Темная', icon: Moon },
  ] as const;


  const handleThemeChange = async (newTheme: 'auto' | 'light' | 'dark') => {
    await save({ theme: newTheme });
    telegram.hapticLight();
    
    // Apply theme immediately
    telegram.setTheme(newTheme);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink">Тема оформления</label>
      <div className="flex gap-2">
        {themes.map(({ value, label, icon: Icon }) => (
          <motion.button
            key={value}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(value)}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
              theme === value
                ? 'bg-mint shadow-soft border-2 border-mint'
                : 'bg-card border-2 border-transparent hover:bg-mint-soft'
            }`}
          >
            <Icon className={`w-5 h-5 ${theme === value ? 'text-white' : 'text-ink'}`} />
            <span className={`text-xs font-medium ${theme === value ? 'text-white' : 'text-ink'}`}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

