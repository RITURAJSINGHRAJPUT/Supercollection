import { useMemo } from 'react';
import { computeAnalytics } from '../services/analyticsService';
import type { Sale } from '../types/sales';
import type { Purchase } from '../types/purchase';
import type { Product } from '../types/product';

export const useAnalytics = (sales: Sale[], purchases: Purchase[], products: Product[]) => {
  const analytics = useMemo(
    () => computeAnalytics(sales, purchases, products),
    [sales, purchases, products]
  );

  return analytics;
};
