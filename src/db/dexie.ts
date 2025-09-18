import Dexie, { Table } from 'dexie';
import { Settings, Tip, Shift } from './models';

class ChaiDB extends Dexie {
  tips!: Table<Tip, string>;
  shifts!: Table<Shift, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super('chai_schitai_v1');
    this.version(1).stores({
      tips: 'id, createdAt, method, shiftId',
      shifts: 'id, startedAt, endedAt',
      settings: 'id'
    });
  }
}

export const db = new ChaiDB();



