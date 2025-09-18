/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tg_bg: 'var(--tg-theme-bg-color)',
        tg_text: 'var(--tg-theme-text-color)',
        tg_hint: 'var(--tg-theme-hint-color)',
        tg_link: 'var(--tg-theme-link-color)',
        tg_button: 'var(--tg-theme-button-color)',
        tg_button_text: 'var(--tg-theme-button-text-color)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
};


