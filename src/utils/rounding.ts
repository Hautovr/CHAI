export type Rounding = 'none' | '1' | '5';

export function applyRounding(amount: number, rounding: Rounding): number {
  if (rounding === 'none') return Math.round(amount * 100) / 100;
  const step = rounding === '1' ? 1 : 5;
  return Math.round(amount / step) * step;
}



