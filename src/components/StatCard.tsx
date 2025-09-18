export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-soft">
      <div className="text-xs text-muted font-medium mb-1">{label}</div>
      <div className="text-lg font-bold text-ink">{value}</div>
    </div>
  );
}


