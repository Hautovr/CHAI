import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../db/dexie';
import { useTips } from './tips.store';
import { useSettings } from './settings.store';

describe('tips.store', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
    await useSettings.getState().load();
    await useTips.getState().load();
  });

  it('adds and removes tip', async () => {
    await useTips.getState().add(100, 'cash');
    expect(useTips.getState().tips.length).toBe(1);
    const id = useTips.getState().tips[0].id;
    await useTips.getState().remove(id);
    expect(useTips.getState().tips.length).toBe(0);
  });
});


