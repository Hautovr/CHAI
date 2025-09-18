export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-card p-4 shadow-soft">
      <div className="text-sm text-muted">{label}</div>
      <div className="text-2xl font-semibold text-ink">{value}</div>
    </div>
  );
}


