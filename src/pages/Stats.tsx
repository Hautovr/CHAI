import { useEffect, useMemo, useState } from 'react';
import { useTips } from '../store/tips.store';
import { Range, rangeForToday, rangeForWeek, rangeForMonth, inRange } from '../utils/date';
import { StatCard } from '../components/StatCard';
import { motion } from 'framer-motion';
import { telegram } from '../lib/telegram';
import { format, eachDayOfInterval, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

type Mode = 'day'|'week'|'month'|'custom';
const MODE_LABEL_RU: Record<Mode, string> = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  custom: 'Диапазон',
};

export function Stats() {
  const { tips, load } = useTips();
  const [mode, setMode] = useState<Mode>('day');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  
  useEffect(()=>{ load(); }, []);

  // Calculate range based on mode
  const range = useMemo((): Range => {
    switch (mode) {
      case 'day': return rangeForToday();
      case 'week': return rangeForWeek();
      case 'month': return rangeForMonth();
      case 'custom':
        if (customFrom && customTo) {
          return {
            from: new Date(customFrom),
            to: new Date(customTo + 'T23:59:59')
          };
        }
        return rangeForToday();
      default: return rangeForToday();
    }
  }, [mode, customFrom, customTo]);

  const filtered = useMemo(() => tips.filter(t => inRange(t.createdAt, range)), [tips, range]);
  const total = filtered.reduce((a, t)=>a+t.amount, 0);
  const count = filtered.length;
  const avg = count ? total / count : 0;

  // Prepare chart data
  const chartData = useMemo(() => {
    if (mode === 'day') {
      // Hourly data for today
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map(hour => {
        const hourTips = filtered.filter(tip => {
          const tipHour = new Date(tip.createdAt).getHours();
          return tipHour === hour;
        });
        const hourTotal = hourTips.reduce((sum, tip) => sum + tip.amount, 0);
        return {
          name: `${hour}:00`,
          value: hourTotal,
          count: hourTips.length
        };
      }).filter(item => item.value > 0 || item.count > 0);
    } else {
      // Daily data for week/month/custom
      const days = eachDayOfInterval({ start: range.from, end: range.to });
      return days.map(day => {
        const dayStart = startOfDay(day).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;
        const dayTips = filtered.filter(tip => tip.createdAt >= dayStart && tip.createdAt <= dayEnd);
        const dayTotal = dayTips.reduce((sum, tip) => sum + tip.amount, 0);
        return {
          name: format(day, mode === 'month' ? 'd' : 'd MMM', { locale: ru }),
          value: dayTotal,
          count: dayTips.length,
          date: format(day, 'yyyy-MM-dd')
        };
      });
    }
  }, [filtered, mode, range]);

  // Payment method distribution
  const methodData = useMemo(() => {
    const methods = ['cash', 'card', 'sbp', 'qr', 'other'];
    const methodLabels = {
      cash: 'Наличные',
      card: 'Карта', 
      sbp: 'СБП',
      qr: 'QR',
      other: 'Другое'
    };
    
    return methods.map(method => {
      const methodTips = filtered.filter(tip => tip.method === method);
      const methodTotal = methodTips.reduce((sum, tip) => sum + tip.amount, 0);
      return {
        name: methodLabels[method as keyof typeof methodLabels],
        value: methodTotal,
        count: methodTips.length
      };
    }).filter(item => item.value > 0);
  }, [filtered]);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleModeChange = (newMode: Mode) => {
    telegram.hapticLight();
    setMode(newMode);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card rounded-xl p-3 shadow-soft border border-mint-soft">
          <p className="text-sm font-medium text-ink">{label}</p>
          <p className="text-mint font-semibold">
            {payload[0].value.toLocaleString()} ₽
          </p>
          {payload[0].payload.count > 0 && (
            <p className="text-xs text-muted">
              {payload[0].payload.count} записей
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card rounded-xl p-3 shadow-soft border border-mint-soft">
          <p className="text-sm font-medium text-ink">{data.name}</p>
          <p className="text-mint font-semibold">
            {data.value.toLocaleString()} ₽
          </p>
          <p className="text-xs text-muted">
            {data.count} записей
          </p>
        </div>
      );
    }
    return null;
  };

  // Get period description
  const periodDescription = useMemo(() => {
    switch (mode) {
      case 'day': return format(range.from, 'd MMMM yyyy', { locale: ru });
      case 'week': return `${format(range.from, 'd MMM', { locale: ru })} - ${format(range.to, 'd MMM yyyy', { locale: ru })}`;
      case 'month': return format(range.from, 'LLLL yyyy', { locale: ru });
      case 'custom': return customFrom && customTo ? `${format(new Date(customFrom), 'd MMM', { locale: ru })} - ${format(new Date(customTo), 'd MMM yyyy', { locale: ru })}` : 'Выберите диапазон';
      default: return '';
    }
  }, [mode, range, customFrom, customTo]);

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Period Selector */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto">
          {(['day','week','month','custom'] as Mode[]).map(m => (
            <motion.button 
              key={m} 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all ${
                m === mode 
                  ? 'bg-mint text-white shadow-soft' 
                  : 'bg-card text-ink hover:bg-mint-soft'
              }`}
            >
              {MODE_LABEL_RU[m]}
            </motion.button>
          ))}
        </div>
        
        {/* Period Description */}
        <div className="text-center text-sm text-muted font-medium">
          {periodDescription}
        </div>
        
        {/* Custom Date Range */}
        {mode === 'custom' && (
          <div className="flex gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink text-sm"
              placeholder="От"
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-card border-2 border-transparent focus:border-mint outline-none text-ink text-sm"
              placeholder="До"
            />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Сумма" value={`${total.toLocaleString()} ₽`} />
        <StatCard label="Записей" value={String(count)} />
        <StatCard label="Среднее" value={`${avg.toFixed(0)} ₽`} />
      </div>

      {/* Charts */}
      {filtered.length > 0 && (
        <div className="space-y-4">
          {/* Time Distribution Chart */}
          {chartData.length > 0 && (
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <h3 className="text-sm font-semibold text-ink mb-3">
                {mode === 'day' ? 'Чаевые по часам' : 'Чаевые по дням'}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--mint-soft)" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    stroke="var(--ink)"
                  />
                  <YAxis 
                    fontSize={12}
                    stroke="var(--ink)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Payment Methods Distribution */}
          {methodData.length > 1 && (
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <h3 className="text-sm font-semibold text-ink mb-3">
                Способы оплаты
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={methodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {methodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  {methodData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="text-xs">
                        <div className="font-medium text-ink">{entry.name}</div>
                        <div className="text-muted">
                          {entry.value.toLocaleString()} ₽
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trend Chart for longer periods */}
          {(mode === 'week' || mode === 'month' || mode === 'custom') && chartData.length > 2 && (
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <h3 className="text-sm font-semibold text-ink mb-3">
                Тренд чаевых
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--mint-soft)" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    stroke="var(--ink)"
                  />
                  <YAxis 
                    fontSize={12}
                    stroke="var(--ink)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Tips List for Current Period */}
      {filtered.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-ink">Записи за период:</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filtered.slice(0, 10).map((tip) => (
              <div key={tip.id} className="bg-card rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-ink">{tip.amount.toLocaleString()} ₽</div>
                  <div className="text-xs text-muted">
                    {format(tip.createdAt, 'd MMM, HH:mm', { locale: ru })}
                  </div>
                </div>
                {tip.note && (
                  <div className="text-xs text-muted max-w-[120px] truncate">
                    {tip.note}
                  </div>
                )}
              </div>
            ))}
            {filtered.length > 10 && (
              <div className="text-center text-sm text-muted py-2">
                и еще {filtered.length - 10} записей...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-ink font-medium">Нет записей за этот период</div>
          <div className="text-sm text-muted">Добавьте чаевые на главной странице</div>
        </div>
      )}
    </div>
  );
}


