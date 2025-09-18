import { eachDayOfInterval, startOfDay, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

export type Range = { from: Date; to: Date };

export function rangeForToday(): Range {
  const now = new Date();
  const from = startOfDay(now);
  const to = new Date(from.getTime() + 24*60*60*1000 - 1);
  return { from, to };
}

export function rangeForWeek(): Range {
  const now = new Date();
  const from = startOfWeek(now, { locale: ru }); // Понедельник
  const to = endOfWeek(now, { locale: ru });
  return { from, to };
}

export function rangeForMonth(): Range {
  const now = new Date();
  const from = startOfMonth(now);
  const to = endOfMonth(now);
  return { from, to };
}

export function buildDailyBuckets(range: Range) {
  return eachDayOfInterval({ start: range.from, end: range.to }).map(d => ({ key: d.getTime(), total: 0 }));
}

export function inRange(ts: number, range: Range) {
  return isWithinInterval(ts, { start: range.from, end: range.to });
}


