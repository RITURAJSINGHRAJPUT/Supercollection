import { useMemo } from 'react';
import { computeAnalytics } from '../services/analyticsService';
import type { Sale } from '../types/sales';
import type { Purchase } from '../types/purchase';
import type { Product } from '../types/product';
import type { QuickEntry } from '../types/quickBill';

export const useAnalytics = (
  sales: Sale[], 
  purchases: Purchase[], 
  products: Product[],
  quickSales: QuickEntry[] = [],
  quickPurchases: QuickEntry[] = []
) => {
  const analytics = useMemo(
    () => computeAnalytics(sales, purchases, products, quickSales, quickPurchases),
    [sales, purchases, products, quickSales, quickPurchases]
  );

  return analytics;
};
