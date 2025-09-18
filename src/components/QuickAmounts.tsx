import { useSettings } from '../store/settings.store';

export function QuickAmounts({ onAdd }: { onAdd: (v: number) => void }) {
  const { quickAmounts } = useSettings();
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {quickAmounts.map(v => (
        <button key={v} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 whitespace-nowrap" onClick={() => onAdd(v)}>
          +{v}
        </button>
      ))}
    </div>
  );
}


