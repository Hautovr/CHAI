import { useState } from 'react';
import { Numpad } from './Numpad';
import { QuickAmounts } from './QuickAmounts';
import { useTips } from '../store/tips.store';
import { useSettings } from '../store/settings.store';
import { telegram } from '../lib/telegram';

const methods: { key: 'cash'|'card'|'sbp'|'qr'|'other'; label: string }[] = [
  { key: 'cash', label: 'Наличные' },
  { key: 'card', label: 'Карта' },
  { key: 'sbp', label: 'СБП' },
  { key: 'qr', label: 'QR' },
  { key: 'other', label: 'Другое' },
];

export function TipForm() {
  const { add, lastMethod } = useTips();
  const { currency } = useSettings();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<typeof methods[number]['key']>(lastMethod);
  const [note, setNote] = useState('');

  async function submit() {
    const val = parseFloat(amount.replace(',', '.'));
    if (!isFinite(val) || val <= 0) return;
    await add(val, method, note || undefined);
    setAmount('');
    telegram.hapticLight();
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="text-center">
        <div className="text-sm text-muted mb-1">Сумма</div>
        <div className="text-4xl font-semibold text-ink tracking-wide">
          {(amount || '0')}{' '}{currency}
        </div>
      </div>
      {/* Methods replaced by goal progress bar on Home */}
      <input value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Заметка" className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800" />
      <QuickAmounts onAdd={(v)=> setAmount(a => (parseFloat(a||'0') + v).toString())} />
      <Numpad value={amount} onChange={setAmount} onSubmit={submit} />
    </div>
  );
}


