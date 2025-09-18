import { telegram } from '../lib/telegram';
import { Settings } from 'lucide-react';

export function Header({ onOpenSettings, isSettingsOpen }: { 
  onOpenSettings: () => void;
  isSettingsOpen?: boolean;
}) {
  const user = telegram.getUser();
  
  console.log('🔧 Header render - isSettingsOpen:', isSettingsOpen);
  
  const handleSettingsClick = () => {
    console.log('🔧 Settings button clicked in Header');
    onOpenSettings();
  };
  
  return (
    <header className="px-4 py-3 flex items-center gap-3">
      <div className="px-4 py-2 rounded-full border-2 border-green-400 bg-green-50/30">
        <div className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent tracking-widest drop-shadow-sm opacity-80">ЧАЙ СЧИТАЙ</div>
      </div>
      <div className="flex-1" />
      
      
      {/* Кнопка настроек */}
      <button 
        onClick={handleSettingsClick}
        className={`p-2 rounded-full transition-all duration-200 ${
          isSettingsOpen 
            ? 'bg-mint-soft border-2 border-mint' 
            : 'bg-mint hover:opacity-90'
        }`}
        aria-label={isSettingsOpen ? "Закрыть настройки" : "Открыть настройки"}
      >
        <Settings 
          className={`w-5 h-5 ${
            isSettingsOpen ? 'rotate-45 text-mint' : 'text-white'
          } transition-transform duration-200`}
        />
      </button>
    </header>
  );
}


