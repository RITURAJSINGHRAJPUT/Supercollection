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

export interface AnalyticsFilters {
  startDate: string;
  endDate: string;
  productId: string;
  category: string;
}

export const computeAnalytics = (
  sales: Sale[],
  purchases: Purchase[],
  products: Product[],
  quickSales: QuickEntry[] = [],
  quickPurchases: QuickEntry[] = [],
  filters?: AnalyticsFilters
): AnalyticsData => {
  // Apply filters if provided
  const filteredSales = !filters ? sales : sales.filter(s => {
    const sDate = new Date(s.date).toISOString().split('T')[0];
    const matchesDate = (!filters.startDate || sDate >= filters.startDate) && 
                       (!filters.endDate || sDate <= filters.endDate);
    const matchesProduct = !filters.productId || s.productId === filters.productId;
    const product = products.find(p => p.id === s.productId);
    const matchesCategory = !filters.category || (product && product.category === filters.category);
    return matchesDate && matchesProduct && matchesCategory;
  });

  const filteredPurchases = !filters ? purchases : purchases.filter(p => {
    const pDate = new Date(p.date).toISOString().split('T')[0];
    const matchesDate = (!filters.startDate || pDate >= filters.startDate) && 
                       (!filters.endDate || pDate <= filters.endDate);
    const matchesProduct = !filters.productId || p.productId === filters.productId;
    const product = products.find(pr => pr.id === p.productId);
    const matchesCategory = !filters.category || (product && product.category === filters.category);
    return matchesDate && matchesProduct && matchesCategory;
  });

  const filteredQuickSales = !filters ? quickSales : quickSales.filter(s => {
    const sDate = new Date(s.date).toISOString().split('T')[0];
    const matchesDate = (!filters.startDate || sDate >= filters.startDate) && 
                       (!filters.endDate || sDate <= filters.endDate);
    const matchesProduct = !filters.productId; // Quick entries don't have product ID
    const matchesCategory = !filters.category || s.category === filters.category;
    return matchesDate && matchesProduct && matchesCategory;
  });

  const filteredQuickPurchases = !filters ? quickPurchases : quickPurchases.filter(p => {
    const pDate = new Date(p.date).toISOString().split('T')[0];
    const matchesDate = (!filters.startDate || pDate >= filters.startDate) && 
                       (!filters.endDate || pDate <= filters.endDate);
    const matchesProduct = !filters.productId; // Quick entries don't have product ID
    const matchesCategory = !filters.category || p.category === filters.category;
    return matchesDate && matchesProduct && matchesCategory;
  });

  const standardSalesTotal = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const quickSalesTotal = filteredQuickSales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = standardSalesTotal + quickSalesTotal;

  const standardPurchasesTotal = filteredPurchases.reduce((sum, p) => sum + p.total, 0);
  const quickPurchasesTotal = filteredQuickPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalPurchases = standardPurchasesTotal + quickPurchasesTotal;

  const profit = totalSales - totalPurchases;

  // Category-wise sales
  const categoryMap = new Map<string, number>();
  filteredSales.forEach(sale => {
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      const cat = product.category;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + sale.total);
    }
  });
  filteredQuickSales.forEach(sale => {
    categoryMap.set(sale.category, (categoryMap.get(sale.category) || 0) + sale.total);
  });
  const categorySales = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  // Top-selling products
  const productSalesMap = new Map<string, { name: string; quantity: number; total: number }>();
  filteredSales.forEach(sale => {
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
  filteredSales.forEach(sale => {
    const month = getMonthYear(new Date(sale.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    monthlyMap.set(month, existing);
  });
  filteredQuickSales.forEach(sale => {
    const month = getMonthYear(new Date(sale.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    monthlyMap.set(month, existing);
  });
  filteredPurchases.forEach(purchase => {
    const month = getMonthYear(new Date(purchase.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    monthlyMap.set(month, existing);
  });
  filteredQuickPurchases.forEach(purchase => {
    const month = getMonthYear(new Date(purchase.date));
    const existing = monthlyMap.get(month) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    monthlyMap.set(month, existing);
  });
  const monthlySales = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .reverse();

  // Daily reports
  const dailyMap = new Map<string, { sales: number; purchases: number }>();
  filteredSales.forEach(sale => {
    const date = new Date(sale.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    dailyMap.set(date, existing);
  });
  filteredQuickSales.forEach(sale => {
    const date = new Date(sale.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.sales += sale.total;
    dailyMap.set(date, existing);
  });
  filteredPurchases.forEach(purchase => {
    const date = new Date(purchase.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    dailyMap.set(date, existing);
  });
  filteredQuickPurchases.forEach(purchase => {
    const date = new Date(purchase.date).toISOString().split('T')[0];
    const existing = dailyMap.get(date) || { sales: 0, purchases: 0 };
    existing.purchases += purchase.total;
    dailyMap.set(date, existing);
  });
  const dailySales = Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // If no date filters, show last 30 days only to avoid overcrowding
  const finalDailySales = (!filters?.startDate && !filters?.endDate) 
    ? dailySales.slice(-30) 
    : dailySales;

  return {
    totalSales,
    totalPurchases,
    profit,
    salesCount: filteredSales.length + filteredQuickSales.length,
    purchasesCount: filteredPurchases.length + filteredQuickPurchases.length,
    categorySales,
    topProducts,
    monthlySales,
    dailySales: finalDailySales,
  };
};


