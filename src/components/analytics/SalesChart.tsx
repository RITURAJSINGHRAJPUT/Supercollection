import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatDate';

interface SalesChartProps {
  data: { date: string; sales: number; purchases: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div className="h-80 w-full animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8E8E93', fontSize: 12 }}
            dy={10}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#8E8E93', fontSize: 12 }}
            tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
          />
          <Tooltip
            cursor={{ fill: '#F5F5F7' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [formatCurrency(Number(value)), '']}
            labelFormatter={(label) => new Date(label as string).toLocaleDateString('en-IN', {
              weekday: 'short', month: 'short', day: 'numeric'
            })}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="sales" name="Sales" fill="#FF6B00" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="purchases" name="Purchases" fill="#4A7CFF" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
