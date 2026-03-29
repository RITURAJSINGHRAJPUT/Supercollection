import { useMemo } from 'react';
import { computeAnalytics, type AnalyticsFilters } from '../services/analyticsService';
import type { Sale } from '../types/sales';
import type { Purchase } from '../types/purchase';
import type { Product } from '../types/product';
import type { QuickEntry } from '../types/quickBill';

export const useAnalytics = (
  sales: Sale[], 
  purchases: Purchase[], 
  products: Product[],
  quickSales: QuickEntry[] = [],
  quickPurchases: QuickEntry[] = [],
  filters?: AnalyticsFilters
) => {
  const analytics = useMemo(
    () => computeAnalytics(sales, purchases, products, quickSales, quickPurchases, filters),
    [sales, purchases, products, quickSales, quickPurchases, filters]
  );

  return analytics;
};
