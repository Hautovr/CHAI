import { memo } from 'react';
import { telegram } from '../lib/telegram';

export default memo(function AppHeader({ name }: { name?: string }) {
  const user = telegram.getUser();
  
  return (
    <div className="rounded-3xl p-4 mb-3 bg-gradient-to-br from-mint to-latte shadow-soft">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white/80 flex items-center justify-center bg-card">
          <img 
            src={user?.photo_url || "/logo.svg"} 
            alt="avatar" 
            className="h-12 w-12 rounded-full object-cover" 
          />
        </div>
        <div>
          <div className="text-sm text-muted">Добро пожаловать</div>
          <div className="text-xl font-semibold text-ink">
            {name ? `${name}, ` : ''}давай посчитаем чаевые!
          </div>
          <div className="text-sm text-muted mt-1">Добавь сумму и нажми «Добавить». Хорошей смены! ✨</div>
        </div>
      </div>
    </div>
  );
});


