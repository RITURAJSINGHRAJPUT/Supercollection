import React from 'react';
import { ArrowUpRight, TrendingUp, AlertCircle, Zap, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import SummaryCards from '../../components/analytics/SummaryCards';
import SalesChart from '../../components/analytics/SalesChart';
import CategoryChart from '../../components/analytics/CategoryChart';
import { useProducts } from '../../hooks/useProducts';
import { useSales } from '../../hooks/useSales';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getPurchases } from '../../services/purchaseService';
import { getQuickSales, getQuickPurchases } from '../../services/quickBillService';
import { formatCurrency } from '../../utils/formatDate';
import { getDriveImageUrl, FALLBACK_IMAGE } from '../../utils/imageUtils';
import type { Purchase } from '../../types/purchase';
import type { QuickEntry } from '../../types/quickBill';

const Dashboard: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useSales();
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = React.useState(true);
  const [quickSales, setQuickSales] = React.useState<QuickEntry[]>([]);
  const [quickPurchases, setQuickPurchases] = React.useState<QuickEntry[]>([]);
  const [quickDataLoading, setQuickDataLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, qsData, qpData] = await Promise.all([
          getPurchases(),
          getQuickSales(),
          getQuickPurchases()
        ]);
        setPurchases(pData);
        setQuickSales(qsData);
        setQuickPurchases(qpData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setPurchasesLoading(false);
        setQuickDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const analytics = useAnalytics(sales, purchases, products, quickSales, quickPurchases);

  if (productsLoading || salesLoading || purchasesLoading || quickDataLoading) {
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
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
          <Link to="/admin/quick-bill" className="btn-outline flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
            <Zap size={14} className="shrink-0" /> Quick Bill
          </Link>
          <Link to="/admin/sales" className="btn-primary flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
            <TrendingUp size={14} className="shrink-0" /> Add Sale
          </Link>
          <Link to="/admin/purchases" className="btn-secondary flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2 whitespace-nowrap">
            <ShoppingCart size={14} className="shrink-0" /> Purchase
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
            <div className="flex items-center gap-3">
              <Link to="/admin/stock-report" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                View Report <ArrowUpRight size={16} />
              </Link>
              <Link to="/admin/products" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                Manage <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-amber-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={getDriveImageUrl(product.imageUrl) || FALLBACK_IMAGE} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src = FALLBACK_IMAGE;
                    }}
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
