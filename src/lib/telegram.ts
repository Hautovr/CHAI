import WebApp from '@twa-dev/sdk';

function applyTheme() {
  const p = WebApp.themeParams;
  const root = document.documentElement;
  const body = document.body;
  
  if (p) {
    // Apply Telegram theme colors
    const set = (k: string, v?: string) => v && root.style.setProperty(`--tg-theme-${k}`, v);
    set('bg-color', p.bg_color || '#ffffff');
    set('text-color', p.text_color || '#000000');
    set('hint-color', p.hint_color || '#6b7280');
    set('link-color', p.link_color || '#0ea5e9');
    set('button-color', p.button_color || '#16a34a');
    set('button-text-color', p.button_text_color || '#ffffff');
    set('secondary-bg-color', p.secondary_bg_color || '#f1f5f9');
    
    // Apply to body directly for immediate effect
    body.style.backgroundColor = p.bg_color || '#ffffff';
    body.style.color = p.text_color || '#000000';
  } else {
    // Fallback for non-Telegram environment
    root.style.setProperty('--tg-theme-bg-color', '#ffffff');
    root.style.setProperty('--tg-theme-text-color', '#000000');
    root.style.setProperty('--tg-theme-hint-color', '#6b7280');
    root.style.setProperty('--tg-theme-link-color', '#0ea5e9');
    root.style.setProperty('--tg-theme-button-color', '#16a34a');
    root.style.setProperty('--tg-theme-button-text-color', '#ffffff');
    root.style.setProperty('--tg-theme-secondary-bg-color', '#f1f5f9');
    
    body.style.backgroundColor = '#ffffff';
    body.style.color = '#000000';
  }
}

export const telegram = {
  init() {
    try {
      WebApp.ready();
      applyTheme();
      WebApp.onEvent('themeChanged', applyTheme);
    } catch (e) {
      // Non-Telegram environment
    }
  },
  hapticLight() {
    try { WebApp.HapticFeedback.impactOccurred('light'); } catch {}
  },
  getUser() {
    try { return WebApp.initDataUnsafe?.user; } catch { return undefined; }
  },
  backButton: {
    show(onClick: () => void) {
      try {
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(onClick);
      } catch {}
    },
    hide() {
      try { WebApp.BackButton.hide(); } catch {}
    }
  }
};


