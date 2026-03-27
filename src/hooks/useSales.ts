import { useEffect, useState } from 'react';
import { subscribeToSales } from '../services/salesService';
import type { Sale } from '../types/sales';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSales((data) => {
      setSales(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { sales, loading };
};
