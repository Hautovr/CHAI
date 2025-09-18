import { create } from 'zustand';
import { db } from '../db/dexie';
import { Tip, TipMethod } from '../db/models';
import { v4 as uuid } from 'uuid';
import { applyRounding } from '../utils/rounding';
import { useSettings } from './settings.store';
import { useShifts } from './shifts.store';

type TipsState = {
  tips: Tip[];
  lastMethod: TipMethod;
  load: () => Promise<void>;
  add: (amount: number, method: TipMethod, note?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (id: string, patch: Partial<Tip>) => Promise<void>;
};

export const useTips = create<TipsState>((set, get) => ({
  tips: [],
  lastMethod: 'cash',
  async load() {
    const tips = await db.tips.orderBy('createdAt').reverse().toArray();
    set({ tips, lastMethod: tips[0]?.method ?? 'cash' });
  },
  async add(amount, method, note) {
    const { rounding, currency } = useSettings.getState();
    const { currentShiftId } = useShifts.getState();
    const rounded = applyRounding(amount, rounding);
    const tip: Tip = {
      id: uuid(),
      amount: rounded,
      currency,
      method,
      note,
      createdAt: Date.now(),
      shiftId: currentShiftId ?? undefined,
      userId: undefined,
    };
    await db.tips.put(tip);
    set(state => ({ tips: [tip, ...state.tips], lastMethod: method }));
  },
  async remove(id) {
    await db.tips.delete(id);
    set(state => ({ tips: state.tips.filter(t => t.id !== id) }));
  },
  async update(id, patch) {
    const existing = await db.tips.get(id);
    if (!existing) return;
    const updated = { ...existing, ...patch } as Tip;
    await db.tips.put(updated);
    set(state => ({ tips: state.tips.map(t => t.id === id ? updated : t) }));
  }
}));


