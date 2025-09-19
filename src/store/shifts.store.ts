import { create } from 'zustand';
import { db } from '../db/dexie';
import { Shift } from '../db/models';
import { v4 as uuid } from 'uuid';
import { startOfDay } from 'date-fns';

type ShiftsState = {
  currentShiftId: string | null;
  shifts: Shift[];
  load: () => Promise<void>;
  startShift: () => Promise<Shift>;
  stopShift: () => Promise<void>;
  ensureTodayShift: () => Promise<void>;
  clearAllShifts: () => Promise<void>;
};

export const useShifts = create<ShiftsState>((set, get) => ({
  currentShiftId: null,
  shifts: [],
  async load() {
    const shifts = await db.shifts.orderBy('startedAt').reverse().toArray();
    const current = shifts.find(s => s.endedAt === null) || null;
    set({ shifts, currentShiftId: current?.id ?? null });
  },
  async startShift() {
    const existing = (await db.shifts.where({ endedAt: null }).first());
    if (existing) { set({ currentShiftId: existing.id }); return existing; }
    const shift: Shift = { id: uuid(), startedAt: Date.now(), endedAt: null, userId: undefined, target: null, venue: undefined };
    await db.shifts.put(shift);
    set(state => ({ shifts: [shift, ...state.shifts], currentShiftId: shift.id }));
    return shift;
  },
  async stopShift() {
    const id = get().currentShiftId;
    if (!id) return;
    const shift = await db.shifts.get(id);
    if (!shift) return;
    shift.endedAt = Date.now();
    await db.shifts.put(shift);
    set(state => ({
      currentShiftId: null,
      shifts: state.shifts.map(s => s.id === id ? shift : s)
    }));
  },
  async ensureTodayShift() {
    const now = Date.now();
    const dayStart = startOfDay(new Date(now)).getTime();
    const open = await db.shifts.where({ endedAt: null }).first();
    if (open) {
      if (open.startedAt >= dayStart) {
        set({ currentShiftId: open.id });
        return;
      }
      // Close yesterday's open shift
      open.endedAt = now;
      await db.shifts.put(open);
    }
    // Start today's shift
    const shift: Shift = { id: uuid(), startedAt: now, endedAt: null, userId: undefined, target: null, venue: undefined };
    await db.shifts.put(shift);
    const shifts = await db.shifts.orderBy('startedAt').reverse().toArray();
    set({ currentShiftId: shift.id, shifts });
  },
  async clearAllShifts() {
    await db.shifts.clear();
    set({ currentShiftId: null, shifts: [] });
  }
}));


