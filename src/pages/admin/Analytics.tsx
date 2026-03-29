import React, { useRef } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useSales } from '../../hooks/useSales';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getPurchases } from '../../services/purchaseService';
import { exportToPdf } from '../../utils/pdfExport';
import { formatCurrency } from '../../utils/formatDate';
import SummaryCards from '../../components/analytics/SummaryCards';
import SalesChart from '../../components/analytics/SalesChart';
import CategoryChart from '../../components/analytics/CategoryChart';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { getQuickSales, getQuickPurchases } from '../../services/quickBillService';
import { getCategories } from '../../services/categoryService';
import type { Purchase } from '../../types/purchase';
import type { QuickEntry } from '../../types/quickBill';
import type { Category } from '../../types/category';
import type { AnalyticsFilters } from '../../services/analyticsService';

const Analytics: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { sales, loading: salesLoading } = useSales();
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [purchasesLoading, setPurchasesLoading] = React.useState(true);
  const [quickSales, setQuickSales] = React.useState<QuickEntry[]>([]);
  const [quickPurchases, setQuickPurchases] = React.useState<QuickEntry[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [quickLoading, setQuickLoading] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  const [filters, setFilters] = React.useState<AnalyticsFilters>({
    startDate: '',
    endDate: '',
    productId: '',
    category: '',
  });
  
  const reportRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, qsData, qpData, cData] = await Promise.all([
          getPurchases(),
          getQuickSales(),
          getQuickPurchases(),
          getCategories()
        ]);
        setPurchases(pData);
        setQuickSales(qsData);
        setQuickPurchases(qpData);
        setCategories(cData);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setPurchasesLoading(false);
        setQuickLoading(false);
      }
    };
    fetchData();
  }, []);

  const analytics = useAnalytics(sales, purchases, products, quickSales, quickPurchases, filters);

  if (productsLoading || salesLoading || purchasesLoading || quickLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleQuickRange = (range: string) => {
    const today = new Date();
    let start = new Date();
    
    switch (range) {
      case 'today':
        break;
      case 'weekly':
        start.setDate(today.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(today.getMonth() - 1);
        break;
      default:
        return;
    }
    
    setFilters({
      ...filters,
      startDate: start.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      await exportToPdf('analytics-report', `SuperCollection_Report_${new Date().toISOString().split('T')[0]}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Analytics & Reports</h1>
          <p className="text-dark-400">Detailed insights into your business performance</p>
        </div>
        <Button onClick={handleExportPdf} icon={<Download size={20} />} loading={isExporting}>
          Export PDF
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-600">Quick Select</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none bg-gray-50/50"
              onChange={(e) => handleQuickRange(e.target.value)}
              value=""
            >
              <option value="" disabled>Choose Period</option>
              <option value="today">Today</option>
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
            </select>
          </div>
          <Input
            label="From Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            label="To Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-600">Product</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              value={filters.productId}
              onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
            >
              <option value="">All Products</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-dark-600">Category</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            {(filters.startDate || filters.endDate || filters.productId || filters.category) && (
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 h-10 w-full lg:w-auto"
                onClick={() => setFilters({ startDate: '', endDate: '', productId: '', category: '' })}
                icon={<RotateCcw size={16} />}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div id="analytics-report" ref={reportRef} className="space-y-6 bg-gray-50 p-2 sm:p-0">
        {/* Hidden title for PDF export */}
        <div className="hidden pdf-show text-center mb-8">
          <h1 className="text-3xl font-bold text-dark-800">Super Collection</h1>
          <h2 className="text-xl text-dark-500">Business Analytics Report</h2>
          <p className="text-sm text-dark-400">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Summary Cards */}
        <SummaryCards data={analytics} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-dark-800 mb-6">Daily Performance</h3>
            <SalesChart data={analytics.dailySales} />
          </div>

          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-dark-800 mb-6">Monthly Revenue & Cost</h3>
            <SalesChart data={analytics.monthlySales.slice(-12).map(m => ({ date: m.month, sales: m.sales, purchases: m.purchases }))} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Setup */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1">
            <h3 className="font-bold text-dark-800 mb-6">Revenue by Category</h3>
            <CategoryChart data={analytics.categorySales} />
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="font-bold text-dark-800 mb-6">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-dark-500 text-sm">
                    <th className="py-2 px-4 font-semibold rounded-tl-lg">Product Name</th>
                    <th className="py-2 px-4 font-semibold text-right">Units Sold</th>
                    <th className="py-2 px-4 font-semibold text-right rounded-tr-lg">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.topProducts.map((product, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-dark-800">{product.name}</td>
                      <td className="py-3 px-4 text-right">{product.quantity}</td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        {formatCurrency(product.total)}
                      </td>
                    </tr>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-dark-400">
                        No products sold yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
