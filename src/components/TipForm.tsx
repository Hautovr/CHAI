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
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Amount Display */}
      <div className="text-center py-4 px-4 bg-gradient-to-b from-card to-transparent flex-shrink-0">
        <div className="text-sm text-muted mb-2">Введите сумму чаевых</div>
        <div className="text-4xl font-bold text-ink tracking-tight mb-1">
          {(amount || '0')}
        </div>
        <div className="text-lg text-muted font-medium">
          {currency}
        </div>
      </div>
      
      {/* Quick Amounts */}
      <div className="flex-shrink-0">
        <QuickAmounts onAdd={(v)=> setAmount(a => (parseFloat(a||'0') + v).toString())} />
      </div>
      
      {/* Note Input */}
      <div className="px-4 pb-2 flex-shrink-0">
        <input 
          value={note} 
          onChange={(e)=>setNote(e.target.value)} 
          placeholder="Заметка (необязательно)" 
          className="w-full px-4 py-3 rounded-2xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink placeholder:text-muted"
        />
      </div>
      
      {/* Numpad */}
      <div className="flex-1 flex items-end">
        <Numpad value={amount} onChange={setAmount} onSubmit={submit} />
      </div>
    </div>
  );
}


