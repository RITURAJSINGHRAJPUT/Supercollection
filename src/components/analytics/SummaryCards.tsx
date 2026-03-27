import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PackagePlus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatDate';
import type { AnalyticsData } from '../../services/analyticsService';

interface SummaryCardsProps {
  data: AnalyticsData;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Total Sales',
      value: formatCurrency(data.totalSales),
      subtitle: `${data.salesCount} transactions`,
      icon: <DollarSign size={24} className="text-white" />,
      color: 'from-green-500 to-emerald-600',
      shadow: 'shadow-green-500/20',
    },
    {
      title: 'Total Purchases',
      value: formatCurrency(data.totalPurchases),
      subtitle: `${data.purchasesCount} restocks`,
      icon: <PackagePlus size={24} className="text-white" />,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(data.profit),
      subtitle: data.profit >= 0 ? 'Profitable' : 'Loss',
      icon: data.profit >= 0 ? <TrendingUp size={24} className="text-white" /> : <TrendingDown size={24} className="text-white" />,
      color: data.profit >= 0 ? 'from-primary-500 to-primary-600' : 'from-red-500 to-rose-600',
      shadow: data.profit >= 0 ? 'shadow-primary-500/20' : 'shadow-red-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div 
          key={card.title} 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-dark-500 font-medium">{card.title}</h3>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.shadow}`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-dark-800 mb-1">{card.value}</p>
            <p className="text-sm text-dark-400">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
