import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { telegram } from './lib/telegram';
import { useI18n } from './lib/i18n';
import { useSettings } from './store/settings.store';

type Tab = 'home' | 'history' | 'stats' | 'settings';

export function App() {
  const { t, lang } = useI18n();
  const { theme, loaded, load: loadSettings } = useSettings();
  const [tab, setTab] = useState<Tab>('home');
  const [forceUpdate, setForceUpdate] = useState(0);
  const tabRef = useRef<Tab>('home');

  // Дебаг изменений tab
  useEffect(() => {
    console.log('🔄 Tab changed to:', tab);
    console.log('🔄 isSettingsOpen will be:', tab === 'settings');
    tabRef.current = tab;
  }, [tab]);

  // Функция переключения настроек с ref
  const toggleSettings = useCallback(() => {
    console.log('🎯 Toggle settings clicked. Current tab:', tab);
    console.log('🎯 Ref tab:', tabRef.current);
    telegram.hapticLight();
    
    const currentTab = tabRef.current;
    const newTab = currentTab === 'settings' ? 'home' : 'settings';
    
    console.log('🚀 Switching from', currentTab, 'to', newTab);
    
    setTab(newTab);
    
    // Принудительное обновление
    setTimeout(() => {
      setForceUpdate(prev => prev + 1);
      console.log('🔄 Force update triggered');
    }, 10);
  }, []);


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
      case 'settings':
        return <Settings />;
    }
  }, [tab]);

  return (
        <div className="flex flex-col h-screen max-h-screen safe-area tg-theme" style={{ backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)' }}>
          <Header 
            key={forceUpdate}
            onOpenSettings={toggleSettings}
            isSettingsOpen={tab === 'settings'}
          />
          
          
          <main className="flex-1 overflow-y-auto min-h-0">{Page}</main>
      <nav className="bg-transparent flex justify-center gap-2 py-2 flex-shrink-0">
        <button 
          className={`px-4 py-2 rounded-2xl ${tab==='home'?'bg-mint font-semibold':'bg-mint-soft'}`} 
          onClick={() => {
            console.log('Bottom nav: Home clicked');
            setTab('home');
          }}
        >
          {t('tabs.today')}
        </button>
        <button 
          className={`px-4 py-2 rounded-2xl ${tab==='history'?'bg-mint font-semibold':'bg-mint-soft'}`} 
          onClick={() => {
            console.log('Bottom nav: History clicked');
            setTab('history');
          }}
        >
          {t('tabs.history')}
        </button>
        <button 
          className={`px-4 py-2 rounded-2xl ${tab==='stats'?'bg-mint font-semibold':'bg-mint-soft'}`} 
          onClick={() => {
            console.log('Bottom nav: Stats clicked');
            setTab('stats');
          }}
        >
          {t('tabs.stats')}
        </button>
        {/* Убрали кнопку "Настройки" из таббара по запросу */}
      </nav>
    </div>
  );
}

