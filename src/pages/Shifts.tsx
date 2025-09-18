import { useEffect } from 'react';
import { useShifts } from '../store/shifts.store';

export function Shifts() {
  const { shifts, load } = useShifts();
  useEffect(()=>{ load(); }, []);
  return (
    <div className="p-4 flex flex-col gap-2">
      {shifts.map(s => (
        <div key={s.id} className="p-3 rounded bg-gray-100 dark:bg-gray-800">
          <div className="font-medium">{new Date(s.startedAt).toLocaleString()} — {s.endedAt ? new Date(s.endedAt).toLocaleString() : '…'}</div>
        </div>
      ))}
    </div>
  );
}



