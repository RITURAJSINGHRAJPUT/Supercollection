import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { useSales } from '../../hooks/useSales';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { addSale, deleteSale } from '../../services/salesService';
import { updateStock } from '../../services/productService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { getToday, formatCurrency, formatDateTime } from '../../utils/formatDate';
import type { SaleFormData } from '../../types/sales';

const Sales: React.FC = () => {
  const { sales, loading: salesLoading } = useSales();
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SaleFormData>({
    productId: '',
    quantity: 1,
    sellingPrice: 0,
    date: getToday(),
  });

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData(prev => ({ ...prev, productId, sellingPrice: product.price }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity <= 0 || formData.sellingPrice <= 0) {
      alert('Please fill out all fields correctly');
      return;
    }

    const product = products.find(p => p.id === formData.productId);
    if (!product) return;

    if (product.stock < formData.quantity) {
      if (!window.confirm(`Warning: This product only has ${product.stock} in stock. Are you sure you want to sell ${formData.quantity}? This will result in negative inventory.`)) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // 1. Add Sale
      await addSale({
        ...formData,
        date: new Date(formData.date).toISOString()
      });

      // 2. Reduce Stock
      await updateStock(product.id, product.stock - formData.quantity);

      setFormData({
        productId: '',
        quantity: 1,
        sellingPrice: 0,
        date: getToday(),
      });
      setSelectedCategory('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Failed to record sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (saleId: string, productId: string, quantity: number) => {
    if (window.confirm('Delete this sale record? Note: This will restore the stock quantity.')) {
      try {
        await deleteSale(saleId);
        
        // Restore stock
        const product = products.find(p => p.id === productId);
        if (product) {
          await updateStock(productId, product.stock + quantity);
        }
      } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Failed to delete record');
      }
    }
  };

  if (productsLoading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800">Sales Register</h1>
          <p className="text-dark-400">Record sales and manage inventory outgoing</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={<Plus size={20} />}>
          New Sale
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-dark-500 text-sm">
                <th className="py-3 px-6 font-semibold">Date</th>
                <th className="py-3 px-6 font-semibold">Product</th>
                <th className="py-3 px-6 font-semibold text-right">Quantity</th>
                <th className="py-3 px-6 font-semibold text-right">Price</th>
                <th className="py-3 px-6 font-semibold text-right">Total</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salesLoading ? (
                <tr>
                   <td colSpan={6} className="py-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-dark-400">
                    <TrendingUp size={48} className="mx-auto text-dark-200 mb-4" />
                    No sales recorded yet.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => {
                  const product = products.find(p => p.id === sale.productId);
                  return (
                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3 px-6 whitespace-nowrap text-dark-600 text-sm">
                        {formatDateTime(sale.date)}
                      </td>
                      <td className="py-3 px-6 font-medium text-dark-800">
                        {product?.name || sale.productName || 'Unknown Product'}
                      </td>
                      <td className="py-3 px-6 text-right font-medium">
                        {sale.quantity}
                      </td>
                      <td className="py-3 px-6 text-right text-dark-600">
                        {formatCurrency(sale.sellingPrice)}
                      </td>
                      <td className="py-3 px-6 text-right font-bold text-green-600">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleDelete(sale.id, sale.productId, sale.quantity)}
                          className="p-1.5 text-dark-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 mx-auto"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Sale"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-1.5">Select Category</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              required
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setFormData(prev => ({ ...prev, productId: '' }));
              }}
            >
              <option value="" disabled>Choose a category...</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-dark-600 mb-1.5">Select Product</label>
             <select
               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 disabled:bg-gray-50 disabled:cursor-not-allowed"
               required
               value={formData.productId}
               onChange={(e) => handleProductSelect(e.target.value)}
               disabled={!selectedCategory}
             >
               <option value="" disabled>Select product...</option>
               {products
                 .filter(p => !selectedCategory || p.category === selectedCategory)
                 .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.stock} | {formatCurrency(p.price)})
                  </option>
                ))}
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity Sold"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            />
            
            <Input
              label="Selling Price per unit (₹)"
              type="number"
              min="0"
              required
              value={formData.sellingPrice || ''}
              onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Sale Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            max={getToday()}
          />

          {formData.quantity > 0 && formData.sellingPrice > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
              <span className="text-dark-500 font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(formData.quantity * formData.sellingPrice)}
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Complete Sale
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;
