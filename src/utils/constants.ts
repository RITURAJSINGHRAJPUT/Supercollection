export const APP_NAME = 'Super Collection';
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';
export const CURRENCY_SYMBOL = '₹';

export const PRODUCT_CATEGORIES = [
  'Mobile Accessories',
  'Custom Gifts',
  'Mobile Recharge',
  'Electronics',
  'Cases & Covers',
  'Chargers & Cables',
  'Earphones & Headphones',
  'Power Banks',
  'Screen Guards',
  'Others',
] as const;

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Products', path: '/admin/products', icon: 'Package' },
  { label: 'Categories', path: '/admin/categories', icon: 'Tags' },
  { label: 'Sales', path: '/admin/sales', icon: 'TrendingUp' },
  { label: 'Purchases', path: '/admin/purchases', icon: 'ShoppingCart' },
  { label: 'Analytics', path: '/admin/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
] as const;
