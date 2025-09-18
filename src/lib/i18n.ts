import { create } from 'zustand';

type Lang = 'ru' | 'en';

const dict = {
  ru: {
    'tabs.today': 'Сегодня',
    'tabs.history': 'История',
    'tabs.stats': 'Статистика',
    'tabs.settings': 'Настройки',
    'today.total': 'Сегодня',
    'home.start': 'Начать смену',
    'home.stop': 'Завершить смену',
    'add': 'Добавить',
    'note': 'Заметка',
    'method.cash': 'Наличные',
    'method.card': 'Карта',
    'method.sbp': 'СБП',
    'method.qr': 'QR',
    'method.other': 'Другое',
    'history.empty': 'Пока нет записей',
    'stats.export': 'Экспорт CSV',
    'settings.title': 'Настройки',
    'settings.currency': 'Валюта по умолчанию',
    'settings.rounding': 'Округление',
    'settings.quick': 'Быстрые суммы',
    'settings.lang': 'Язык',
  },
  en: {
    'tabs.today': 'Today',
    'tabs.history': 'History',
    'tabs.stats': 'Stats',
    'tabs.settings': 'Settings',
    'today.total': 'Today',
    'home.start': 'Start shift',
    'home.stop': 'Stop shift',
    'add': 'Add',
    'note': 'Note',
    'method.cash': 'Cash',
    'method.card': 'Card',
    'method.sbp': 'SBP',
    'method.qr': 'QR',
    'method.other': 'Other',
    'history.empty': 'No records yet',
    'stats.export': 'Export CSV',
    'settings.title': 'Settings',
    'settings.currency': 'Default currency',
    'settings.rounding': 'Rounding',
    'settings.quick': 'Quick amounts',
    'settings.lang': 'Language',
  }
} as const;

type I18nState = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export const i18nStore = create<I18nState>((set, get) => ({
  lang: 'ru',
  setLang: (l) => set({ lang: l })
}));

// Augment hook with translator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(i18nStore as any).getState = (i18nStore as unknown as any).getState;

export function tKey(lang: Lang, key: keyof typeof dict['ru']) {
  return dict[lang][key] ?? key;
}

export function useTranslator() {
  const { lang, setLang } = (i18nStore as unknown as any)();
  return {
    lang,
    setLang,
    t: (key: keyof typeof dict['ru']) => tKey(lang, key)
  };
}

// Back-compat default hook name used in app
export { useTranslator as useI18n };


