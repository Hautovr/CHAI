import { telegram } from '../lib/telegram';
import { Settings } from 'lucide-react';

export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  const user = telegram.getUser();
  const fallbackLogo = '/logo.svg';
  return (
    <header className="px-4 py-3 flex items-center gap-3">
      <img src="/logo2.svg" alt="logo" className="w-12 h-12 rounded" />
      <div className="px-4 py-2 rounded-full border-2 border-green-400 bg-green-50/30">
        <div className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent tracking-widest drop-shadow-sm opacity-80">ЧАЙ СЧИТАЙ</div>
      </div>
      <div className="flex-1" />
      <button className="p-2 rounded-full bg-mint hover:opacity-90" onClick={onOpenSettings} aria-label="Настройки">
        <Settings className="w-5 h-5" />
      </button>
    </header>
  );
}


