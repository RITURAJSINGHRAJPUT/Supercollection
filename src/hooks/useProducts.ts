import { useEffect, useState } from 'react';
import { subscribeToProducts } from '../services/productService';
import { subscribeToCategories } from '../services/categoryService';
import type { Product } from '../types/product';
import type { Category } from '../types/category';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { products, loading };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { categories, loading };
};
