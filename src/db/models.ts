import { z } from 'zod';

export const TipMethod = z.enum(['cash','card','sbp','qr','other']);
export type TipMethod = z.infer<typeof TipMethod>;

export const TipSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().min(1),
  method: TipMethod,
  note: z.string().optional(),
  createdAt: z.number(),
  shiftId: z.string().optional(),
});
export type Tip = z.infer<typeof TipSchema>;

export const ShiftSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  startedAt: z.number(),
  endedAt: z.number().nullable(),
  target: z.number().nullable().optional(),
  venue: z.string().optional(),
});
export type Shift = z.infer<typeof ShiftSchema>;

export const SettingsSchema = z.object({
  id: z.literal('settings'),
  currency: z.string().default('RUB'),
  rounding: z.enum(['none','1','5']).default('none'),
  quickAmounts: z.array(z.number()).default([50,100,200,500]),
  lang: z.enum(['ru','en']).default('ru'),
  showAvatar: z.boolean().default(true),
  dailyTarget: z.number().default(3000),
});
export type Settings = z.infer<typeof SettingsSchema>;


