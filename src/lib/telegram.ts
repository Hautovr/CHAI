import WebApp from '@twa-dev/sdk';

function applyTheme() {
  const p = WebApp.themeParams;
  if (!p) return;
  const root = document.documentElement;
  const set = (k: string, v?: string) => v && root.style.setProperty(`--tg-theme-${k}`, v);
  set('bg-color', p.bg_color);
  set('text-color', p.text_color);
  set('hint-color', p.hint_color);
  set('link-color', p.link_color);
  set('button-color', p.button_color);
  set('button-text-color', p.button_text_color);
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


