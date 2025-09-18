import { telegram } from '../lib/telegram';
import { Settings } from 'lucide-react';

export function Header({ onOpenSettings, isSettingsOpen }: { 
  onOpenSettings: () => void;
  isSettingsOpen?: boolean;
}) {
  const user = telegram.getUser();
  const fallbackLogo = '/logo.svg';
  
  console.log('Header render - isSettingsOpen:', isSettingsOpen);
  
  return (
    <header className="px-4 py-3 flex items-center gap-3">
      <img src="/logo2.svg" alt="logo" className="w-12 h-12 rounded" />
      <div className="px-4 py-2 rounded-full border-2 border-green-400 bg-green-50/30">
        <div className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent tracking-widest drop-shadow-sm opacity-80">ЧАЙ СЧИТАЙ</div>
      </div>
      <div className="flex-1" />
      <button 
        className={`p-2 rounded-full transition-all duration-200 ${
          isSettingsOpen 
            ? 'bg-mint-soft border-2 border-mint shadow-inner' 
            : 'bg-mint hover:opacity-90 shadow-soft'
        }`} 
        onClick={() => {
          console.log('Settings button clicked in Header. isSettingsOpen:', isSettingsOpen);
          onOpenSettings();
        }} 
        aria-label={isSettingsOpen ? "Закрыть настройки" : "Открыть настройки"}
        style={{ 
          backgroundColor: isSettingsOpen ? 'var(--mint-soft)' : 'var(--mint)',
          borderColor: isSettingsOpen ? 'var(--mint)' : 'transparent'
        }}
      >
        <Settings 
          className={`w-5 h-5 transition-transform duration-200`}
          style={{
            transform: isSettingsOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            color: isSettingsOpen ? 'var(--mint)' : 'white'
          }}
        />
      </button>
    </header>
  );
}


