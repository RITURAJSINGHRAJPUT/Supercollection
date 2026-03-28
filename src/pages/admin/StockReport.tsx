import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../utils/formatDate';
import { Printer, Package, ChevronRight, AlertCircle } from 'lucide-react';

interface GroupedProducts {
  [category: string]: {
    products: any[];
    totalStock: number;
    totalValue: number;
  };
}

const StockReport: React.FC = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Group products by category
  const groupedData: GroupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { products: [], totalStock: 0, totalValue: 0 };
    }
    acc[category].products.push(product);
    acc[category].totalStock += product.stock;
    acc[category].totalValue += product.price * product.stock;
    return acc;
  }, {} as GroupedProducts);

  const categories = Object.keys(groupedData).sort();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Stock Report</h1>
          <p className="text-dark-400">Inventory levels by category and product</p>
        </div>
        <button
          onClick={handlePrint}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Printer size={18} />
          Print Report
        </button>
      </div>

      {/* Report Header for Print */}
      <div className="hidden print:block text-center border-b-2 border-dark-900 pb-4 mb-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-1">Stock Report</h1>
        <p className="text-dark-600">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-dark-400 capitalize">Total Products</p>
            <p className="text-lg font-bold text-dark-800">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
            <ChevronRight size={20} />
          </div>
          <div>
            <p className="text-xs text-dark-400 capitalize">Total Stock Items</p>
            <p className="text-lg font-bold text-dark-800">
              {products.reduce((acc, p) => acc + p.stock, 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-dark-400 capitalize">Low Stock Items</p>
            <p className="text-lg font-bold text-amber-600">
              {products.filter(p => p.stock <= 5).length}
            </p>
          </div>
        </div>
      </div>

      {/* Category Wise Tables */}
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden break-inside-avoid">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-dark-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                {category}
              </h3>
              <div className="text-right flex gap-4 text-xs font-semibold text-dark-400">
                <span>Items: {groupedData[category].totalStock}</span>
                <span>Value: {formatCurrency(groupedData[category].totalValue)}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-xs font-bold text-dark-400 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-dark-400 uppercase tracking-wider text-right">Price</th>
                    <th className="px-6 py-3 text-xs font-bold text-dark-400 uppercase tracking-wider text-right">Stock</th>
                    <th className="px-6 py-3 text-xs font-bold text-dark-400 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {groupedData[category].products.sort((a, b) => a.name.localeCompare(b.name)).map(product => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-dark-700">{product.name}</td>
                      <td className="px-6 py-3 text-sm text-dark-500 text-right">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-3 text-sm font-bold text-dark-800 text-right">{product.stock}</td>
                      <td className="px-6 py-3 text-center">
                        {product.stock === 0 ? (
                          <span className="px-2 py-1 rounded-md bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                            Out of Stock
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                            Perfect
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package size={48} className="mx-auto text-dark-200 mb-4" />
            <h3 className="text-xl font-bold text-dark-500">No Inventory Data</h3>
            <p className="text-dark-400">Add products to see stock reports.</p>
          </div>
        )}
      </div>

      {/* Footer for Print */}
      <div className="hidden print:block text-xs text-dark-400 text-center pt-8">
        <p>SUPER COLLECTION - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default StockReport;
