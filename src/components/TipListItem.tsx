import { Tip } from '../db/models';

const methodTone: Record<string, string> = {
  cash: 'bg-mint text-ink',
  card: 'bg-peach text-ink',
  sbp: 'bg-latte text-ink',
  qr: 'bg-mint text-ink',
  other: 'bg-peach text-ink',
};

export function TipListItem({ tip, onDelete }: { tip: Tip; onDelete: (id: string) => void }) {
  const time = new Date(tip.createdAt).toLocaleTimeString();
  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold text-ink">{tip.amount.toLocaleString()} {tip.currency}</div>
        <div className="text-sm text-muted">
          {time}
          {tip.tables ? ` · ${tip.tables} столов` : ''}
          {tip.note ? ` · ${tip.note}` : ''}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-sm ${methodTone[tip.method]}`}>{tip.method}</span>
        <button className="text-sm text-red-500" onClick={() => onDelete(tip.id)} aria-label="Удалить запись">✖</button>
      </div>
    </div>
  );
}


