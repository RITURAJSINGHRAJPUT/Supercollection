import type { Sale } from '../types/sales';
import type { Purchase } from '../types/purchase';
import type { Product } from '../types/product';
import type { QuickEntry } from '../types/quickBill';
import { getMonthYear } from '../utils/formatDate';

export interface AnalyticsData {
  totalSales: number;
  totalPurchases: number;
  profit: number;
  salesCount: number;
  purchasesCount: number;
  categorySales: { category: string; total: number }[];
  topProducts: { name: string; quantity: number; total: number }[];
  monthlySales: { month: string; sales: number; purchases: number }[];
  dailySales: { date: string; sales: number; purchases: number }[];
}

export const computeAnalytics = (
  sales: Sale[],
  purchases: Purchase[],
  products: Product[],
  quickSales: QuickEntry[] = [],
  quickPurchases: QuickEntry[] = []
): AnalyticsData => {
  const standardSalesTotal = sales.reduce((sum, s) => sum + s.total, 0);
  const quickSalesTotal = quickSales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = standardSalesTotal + quickSalesTotal;

  const standardPurchasesTotal = purchases.reduce((sum, p) => sum + p.total, 0);
  const quickPurchasesTotal = quickPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalPurchases = standardPurchasesTotal + quickPurchasesTotal;

  const profit = totalSales - totalPurchases;

  // Category-wise sales
  const categoryMap = new Map<string, number>();
  sales.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const cat = product.category;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + sale.total);
    }
  });
  quickSales.forEach(sale => {
    categoryMap.set(sale.category, (categoryMap.get(sale.category) || 0) + sale.total);
  });
  const categorySales = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // Top-selling products
  const productSalesMap = new Map<string, { name: string; quantity: number; total: number }>();
  sales.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    const name = product?.name || sale.productName || 'Unknown';
    const existing = productSalesMap.get(sale.productId);
    if (existing) {
      existing.quantity += sale.quantity;
      existing.total += sale.total;
    } else {
      productSalesMap.set(sale.productId, {
        name,
        quantity: sale.quantity,
        total: sale.total,
      });
    }
  });
  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Monthly reports
  const monthlyMap = new Map<string, { sales: number; purchases: number }>();
  sales.forEach(sale => {
    const month = getMonthYear(new Date(sale.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    monthlyMap.set(month, existing);
  });
  quickSales.forEach(sale => {
    const month = getMonthYear(new Date(sale.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    monthlyMap.set(month, existing);
  });
  purchases.forEach(purchase => {
    const month = getMonthYear(new Date(purchase.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    monthlyMap.set(month, existing);
  });
  quickPurchases.forEach(purchase => {
    const month = getMonthYear(new Date(purchase.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    monthlyMap.set(month, existing);
  });
  const monthlySales = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .reverse();

  // Daily reports (last 30 days)
  const dailyMap = new Map<string, { sales: number; purchases: number }>();
  sales.forEach(sale => {
    const date = new Date(sale.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    dailyMap.set(date, existing);
  });
  quickSales.forEach(sale => {
    const date = new Date(sale.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    dailyMap.set(date, existing);
  });
  purchases.forEach(purchase => {
    const date = new Date(purchase.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    dailyMap.set(date, existing);
  });
  quickPurchases.forEach(purchase => {
    const date = new Date(purchase.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    dailyMap.set(date, existing);
  });
  const dailySales = Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  return {
    totalSales,
    totalPurchases,
    profit,
    salesCount: sales.length + quickSales.length,
    purchasesCount: purchases.length + quickPurchases.length,
    categorySales,
    topProducts,
    monthlySales,
    dailySales,
  };
};
