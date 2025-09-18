import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { Stats } from './pages/Stats';
import { Settings } from './pages/Settings';
import { Shifts } from './pages/Shifts';
import { telegram } from './lib/telegram';
import { useI18n } from './lib/i18n';

type Tab = 'home' | 'history' | 'stats' | 'settings';

export function App() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>('home');

  useEffect(() => {
    telegram.init();
  }, []);

  const Page = useMemo(() => {
    switch (tab) {
      case 'home':
        return <Home onOpenShifts={() => setTab('settings')} />;
      case 'history':
        return <History />;
      case 'stats':
        return <Stats />;
      case 'settings':
        return <Settings />;
    }
  }, [tab]);

  return (
    <div className="flex flex-col h-full safe-area">
      <Header onOpenSettings={() => setTab('settings')} />
      <main className="flex-1 overflow-y-auto">{Page}</main>
      <nav className="bg-transparent flex justify-center gap-2 py-2">
        <button className={`px-4 py-2 rounded-2xl ${tab==='home'?'bg-mint font-semibold':'bg-mint-soft'}`} onClick={() => setTab('home')}>{t('tabs.today')}</button>
        <button className={`px-4 py-2 rounded-2xl ${tab==='history'?'bg-mint font-semibold':'bg-mint-soft'}`} onClick={() => setTab('history')}>{t('tabs.history')}</button>
        <button className={`px-4 py-2 rounded-2xl ${tab==='stats'?'bg-mint font-semibold':'bg-mint-soft'}`} onClick={() => setTab('stats')}>{t('tabs.stats')}</button>
        {/* Убрали кнопку "Настройки" из таббара по запросу */}
      </nav>
    </div>
  );
}

