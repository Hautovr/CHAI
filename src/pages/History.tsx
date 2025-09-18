import { useEffect } from 'react';
import { useTips } from '../store/tips.store';
import { TipListItem } from '../components/TipListItem';
import EmptyState from '../components/EmptyState';

export function History() {
  const { tips, load, remove } = useTips();
  useEffect(() => { load(); }, []);
  return (
    <div className="p-4 flex flex-col gap-3">
      {tips.length === 0 ? (
        <EmptyState title="Первая запись — ура!" hint="Добавь сумму и нажми “Добавить”" />
      ) : (
        tips.map(t => (
          <TipListItem key={t.id} tip={t} onDelete={remove} />
        ))
      )}
    </div>
  );
}


