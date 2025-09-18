import { Tip } from '../db/models';

export function tipsToCSV(tips: Tip[]): string {
  const header = 'id,createdAt,amount,currency,method,shiftId,note,source\n';
  const rows = tips.map(t => [
    t.id,
    new Date(t.createdAt).toISOString(),
    t.amount.toString(),
    t.currency,
    t.method,
    t.shiftId ?? '',
    (t.note ?? '').replaceAll('"','""'),
    t.userId ?? ''
  ].map(v => /[",\n]/.test(v) ? `"${v}"` : v).join(','));
  return header + rows.join('\n');
}

export async function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareCSV(filename: string, csv: string) {
  if ((navigator as any).share) {
    const file = new File([csv], filename, { type: 'text/csv' });
    await (navigator as any).share({ files: [file], title: filename });
  } else {
    await downloadCSV(filename, csv);
  }
}


