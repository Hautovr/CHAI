import WebApp from '@twa-dev/sdk';

function applyTheme() {
  const p = WebApp.themeParams;
  const root = document.documentElement;
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('dark-theme', 'light-theme');
  
  if (p && p.bg_color) {
    // Determine if it's dark theme based on background color
    const isDark = isDarkColor(p.bg_color);
    
    // Apply Telegram theme colors
    const set = (k: string, v?: string) => {
      if (v) root.style.setProperty(`--tg-theme-${k}`, v);
    };
    
    set('bg-color', p.bg_color);
    set('text-color', p.text_color);
    set('hint-color', p.hint_color);
    set('link-color', p.link_color);
    set('button-color', p.button_color);
    set('button-text-color', p.button_text_color);
    set('secondary-bg-color', p.secondary_bg_color);
    
    // Apply theme class based on detected theme
    body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    
    // Apply to body directly for immediate effect
    body.style.backgroundColor = p.bg_color;
    body.style.color = p.text_color || (isDark ? '#f1f5f9' : '#000000');
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    // Fallback for non-Telegram environment - detect system theme
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (systemDark) {
      body.classList.add('dark-theme');
      root.setAttribute('data-theme', 'dark');
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
    } else {
      body.classList.add('light-theme');
      root.setAttribute('data-theme', 'light');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#000000';
    }
  }
}

// Helper function to determine if a color is dark
function isDarkColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if color is dark (luminance < 0.5)
  return luminance < 0.5;
}

export const telegram = {
  init() {
    try {
      WebApp.ready();
      applyTheme();
      WebApp.onEvent('themeChanged', applyTheme);
    } catch (e) {
      // Non-Telegram environment
      console.log('Running outside Telegram, using system theme');
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
    }
    
    // Apply theme immediately
    applyTheme();
  },
  
  // Manual theme application
  setTheme(theme: 'auto' | 'light' | 'dark') {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('dark-theme', 'light-theme', 'auto-theme');
    
    if (theme === 'dark') {
      // Force dark theme
      body.classList.add('dark-theme');
      root.setAttribute('data-theme', 'dark');
      
      // Apply dark colors directly
      root.style.setProperty('--tg-theme-bg-color', '#0f172a');
      root.style.setProperty('--tg-theme-text-color', '#f1f5f9');
      root.style.setProperty('--tg-theme-hint-color', '#94a3b8');
      root.style.setProperty('--tg-theme-secondary-bg-color', '#1e293b');
      
      body.style.backgroundColor = '#0f172a';
      body.style.color = '#f1f5f9';
      
    } else if (theme === 'light') {
      // Force light theme
      body.classList.add('light-theme');
      root.setAttribute('data-theme', 'light');
      
      // Apply light colors directly
      root.style.setProperty('--tg-theme-bg-color', '#ffffff');
      root.style.setProperty('--tg-theme-text-color', '#000000');
      root.style.setProperty('--tg-theme-hint-color', '#6b7280');
      root.style.setProperty('--tg-theme-secondary-bg-color', '#f8fafc');
      
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#000000';
      
    } else {
      // Auto theme - use Telegram theme or system preference
      body.classList.add('auto-theme');
      applyTheme();
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


