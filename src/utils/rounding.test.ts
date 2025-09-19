import { describe, it, expect } from 'vitest';
import { applyRounding } from './rounding';

describe('applyRounding', () => {
  it('no rounding keeps decimals', () => {
    expect(applyRounding(12.34, 'none')).toBeCloseTo(12.34, 2);
  });
  it('round to 1', () => {
    expect(applyRounding(12.4, '1')).toBe(12);
    expect(applyRounding(12.6, '1')).toBe(13);
  });
  it('round to 5', () => {
    expect(applyRounding(12, '5')).toBe(10);
    expect(applyRounding(13, '5')).toBe(15);
  });
});




