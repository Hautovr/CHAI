import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { AchievementsPage } from './pages/AchievementsPage';
import { telegram } from './lib/telegram';
import { useI18n } from './lib/i18n';
import { useSettings } from './store/settings.store';

type Tab = 'home' | 'history' | 'stats' | 'achievements' | 'settings';

export function App() {
  const { t, lang } = useI18n();
  const { theme, loaded, load: loadSettings } = useSettings();
  const [tab, setTab] = useState<Tab>('home');
  // Дебаг изменений tab
  useEffect(() => {
    console.log('🔄 Tab changed to:', tab);
    console.log('🔄 isSettingsOpen will be:', tab === 'settings');
  }, [tab]);

  // Функция переключения настроек
  const toggleSettings = useCallback(() => {
    console.log('🎯 Toggle settings clicked. Current tab:', tab);
    telegram.hapticLight();
    
    const newTab = tab === 'settings' ? 'home' : 'settings';
    
    console.log('🚀 Switching from', tab, 'to', newTab);
    
    setTab(newTab);
  }, [tab]);


  useEffect(() => {
    telegram.init();
    loadSettings().then((settings) => {
      console.log('Settings loaded, applying theme:', settings.theme);
      telegram.setTheme(settings.theme);
    });
  }, []);

  // Apply theme when it changes after initial load
  useEffect(() => {
    if (loaded && theme) {
      console.log('Theme changed to:', theme);
      telegram.setTheme(theme);
    }
  }, [theme, loaded]);

  // Listen for time changes when in auto mode (check every hour)
  useEffect(() => {
    if (theme === 'auto') {
      const checkTime = () => {
        console.log('Checking time for auto theme update');
        telegram.setTheme('auto');
      };
      
      // Check every hour (3600000 ms)
      const interval = setInterval(checkTime, 3600000);
      
      return () => clearInterval(interval);
    }
  }, [theme]);

  const Page = useMemo(() => {
    switch (tab) {
      case 'home':
        return <Home onOpenShifts={() => {
          console.log('Home component trying to open settings');
          // Не используем эту функцию, так как настройки теперь открываются через Header
        }} />;
      case 'history':
        return <History />;
      case 'stats':
        return <Stats />;
      case 'achievements':
        return <AchievementsPage />;
      case 'settings':
        return <Settings />;
    }
  }, [tab]);

  return (
        <div className="flex flex-col h-screen max-h-screen safe-area tg-theme" style={{ backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)' }}>
          <Header 
            onOpenSettings={toggleSettings}
            isSettingsOpen={tab === 'settings'}
          />
          
          
          <main className="flex-1 overflow-y-auto min-h-0">{Page}</main>
      <nav className="bg-transparent flex justify-center gap-1 py-3 flex-shrink-0">
        <motion.button 
          className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-500 ${tab==='home'?'bg-mint text-white shadow-2xl':'bg-mint-soft text-ink hover:bg-mint/40'}`}
          initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: -90 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: 0.1, 
            type: "spring", 
            stiffness: 200,
            damping: 15,
            duration: 0.8
          }}
          whileHover={{ 
            scale: 1.15,
            y: -8,
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
            transition: { duration: 0.4, type: "spring", stiffness: 300 }
          }}
          whileTap={{ 
            scale: 0.85,
            y: 2,
            rotateY: -2,
            transition: { duration: 0.2 }
          }}
          onClick={() => {
            console.log('Bottom nav: Home clicked');
            telegram.hapticLight();
            setTab('home');
          }}
        >
          {t('tabs.today')}
        </motion.button>
        
        <motion.button 
          className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-500 ${tab==='history'?'bg-mint text-white shadow-2xl':'bg-mint-soft text-ink hover:bg-mint/40'}`}
          initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: -90 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15,
            duration: 0.8
          }}
          whileHover={{ 
            scale: 1.15,
            y: -8,
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
            transition: { duration: 0.4, type: "spring", stiffness: 300 }
          }}
          whileTap={{ 
            scale: 0.85,
            y: 2,
            rotateY: -2,
            transition: { duration: 0.2 }
          }}
          onClick={() => {
            console.log('Bottom nav: History clicked');
            telegram.hapticLight();
            setTab('history');
          }}
        >
          {t('tabs.history')}
        </motion.button>
        
        <motion.button 
          className={`px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-500 ${tab==='stats'?'bg-mint text-white shadow-2xl':'bg-mint-soft text-ink hover:bg-mint/40'}`}
          initial={{ scale: 0.5, opacity: 0, y: 50, rotateX: -90 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          transition={{ 
            delay: 0.3, 
            type: "spring", 
            stiffness: 200,
            damping: 15,
            duration: 0.8
          }}
          whileHover={{ 
            scale: 1.15,
            y: -8,
            rotateY: 5,
            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
            transition: { duration: 0.4, type: "spring", stiffness: 300 }
          }}
          whileTap={{ 
            scale: 0.85,
            y: 2,
            rotateY: -2,
            transition: { duration: 0.2 }
          }}
          onClick={() => {
            console.log('Bottom nav: Stats clicked');
            telegram.hapticLight();
            setTab('stats');
          }}
        >
          {t('tabs.stats')}
        </motion.button>

        {/* Убрали кнопку "Настройки" из таббара по запросу */}
      </nav>
    </div>
  );
}

