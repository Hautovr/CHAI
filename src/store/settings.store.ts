import { create } from 'zustand';
import { db } from '../db/dexie';
import { Settings, SettingsSchema } from '../db/models';

type SettingsState = Settings & {
  loaded: boolean;
  load: () => Promise<void>;
  save: (patch: Partial<Settings>) => Promise<void>;
};

const defaultSettings: Settings = {
  id: 'settings',
  currency: 'RUB',
  rounding: 'none',
  quickAmounts: [50,100,200,500],
  lang: 'ru',
  showAvatar: true,
  dailyTarget: 3000,
  theme: 'auto',
};

export const useSettings = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  loaded: false,
  async load() {
    const existing = await db.settings.get('settings');
    const settings = existing ? { ...defaultSettings, ...existing } : defaultSettings;
    
    if (!existing) {
      await db.settings.put(defaultSettings);
    }
    
    set({ ...settings, loaded: true });
    
    // Apply theme immediately after loading
    console.log('Settings loaded, theme:', settings.theme);
    return settings;
  },
  async save(patch) {
    const merged = SettingsSchema.parse({ ...get(), ...patch });
    await db.settings.put(merged);
    set(merged);
  }
}));


