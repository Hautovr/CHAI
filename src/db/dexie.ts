import Dexie, { Table } from 'dexie';
import { Settings, Tip, Shift, Achievement, Streak } from './models';

class ChaiDB extends Dexie {
  tips!: Table<Tip, string>;
  shifts!: Table<Shift, string>;
  settings!: Table<Settings, string>;
  achievements!: Table<Achievement, string>;
  streaks!: Table<Streak, string>;

  constructor() {
    super('chai_schitai_v2');
    this.version(2).stores({
      tips: 'id, createdAt, method, shiftId',
      shifts: 'id, startedAt, endedAt',
      settings: 'id',
      achievements: 'id, type, unlockedAt, userId',
      streaks: 'id, type, userId'
    });
  }
}

export const db = new ChaiDB();



