export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center p-8 rounded-3xl bg-card shadow-soft">
      <div className="text-5xl mb-3" aria-label="Чай">🍵</div>
      <div className="text-ink font-semibold text-lg">{title}</div>
      {hint && <div className="text-muted mt-1">{hint}</div>}
    </div>
  );
}


