import React from 'react';
import { ArrowUpRight, Package, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import SummaryCards from '../../components/analytics/SummaryCards';
import SalesChart from '../../components/analytics/SalesChart';
import CategoryChart from '../../components/analytics/CategoryChart';
import { useProducts } from '../../hooks/useProducts';
import { useSales } from '../../hooks/useSales';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getPurchases } from '../../services/purchaseService';
import { formatCurrency } from '../../utils/formatDate';
import type { Purchase } from '../../types/purchase';

const Dashboard: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useSales();
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = React.useState(true);

  React.useEffect(() => {
    getPurchases().then((data) => {
      setPurchases(data);
      setPurchasesLoading(false);
    }).catch(err => {
      console.error('Error fetching purchases:', err);
      setPurchasesLoading(false);
    });
  }, []);

  const analytics = useAnalytics(sales, purchases, products);

  if (productsLoading || salesLoading || purchasesLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const lowStockProducts = products.filter(p => p.stock <= 5).slice(0, 5);
  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Dashboard Overview</h1>
          <p className="text-dark-400">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/sales" className="btn-primary shadow-sm">
            <TrendingUp size={18} /> Add Sale
          </Link>
          <Link to="/admin/products" className="btn-secondary shadow-sm">
            <Package size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-dark-800">Sales & Purchases (30 Days)</h3>
            <Link to="/admin/analytics" className="text-sm text-primary-500 hover:text-primary-600 font-medium">View Detailed Report</Link>
          </div>
          <SalesChart data={analytics.dailySales} />
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="font-bold text-dark-800 mb-6">Sales by Category</h3>
          <CategoryChart data={analytics.categorySales} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-dark-800">Recent Sales</h3>
            <Link to="/admin/sales" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentSales.map(sale => {
              const product = products.find(p => p.id === sale.productId);
              return (
                <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-dark-800">{product?.name || sale.productName || 'Unknown Product'}</p>
                      <p className="text-xs text-dark-400">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dark-800">{formatCurrency(sale.total)}</p>
                    <p className="text-xs text-dark-400">Qty: {sale.quantity}</p>
                  </div>
                </div>
              );
            })}
            {recentSales.length === 0 && (
              <div className="text-center py-8 text-dark-400">No recent sales</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-dark-800 flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              Low Stock Alerts
            </h3>
            <Link to="/admin/products" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
              Manage <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-amber-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/40'} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                  />
                  <div>
                    <p className="font-medium text-dark-800 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-dark-400">{formatCurrency(product.price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${product.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                    {product.stock} left
                  </span>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center py-8 text-dark-400 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>All stock levels look healthy!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
